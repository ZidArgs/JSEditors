import CustomElement from "/emcJS/ui/element/CustomElement.js";
import EventTargetManager from "/emcJS/util/event/EventTargetManager.js";
import UGen from "/emcJS/util/UniqueGenerator.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import "/emcJS/ui/container/CaptionPanel.js";
import "/emcJS/ui/container/CollapsePanel.js";
import "/emcJS/ui/form/FormContainer.js";
import "./components/StructureEditor.js";
import "./components/StructureEditorTree.js";
import "./components/FormDetailEditor.js";
import "./components/FormElementDetailEditor.js";
import TPL from "./Editor.js.html" assert {type: "html"};
import STYLE from "./Editor.js.css" assert {type: "css"};

const DEFAULT_CONFIG = {
    forms: [],
    hasHeader: false,
    hasFooter: false,
    defaultValues: {}
};

class Editor extends CustomElement {

    #config = deepClone(DEFAULT_CONFIG);

    #editPath = [];

    #detailEditorFormEl;

    #detailEditorFormElementEl;

    #previewEl;

    #previewFormContext = new FormContext();

    #previewClickHandler = new EventTargetManager();

    #structureEditorTreeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#previewEl = this.shadowRoot.getElementById("preview-panel");
        this.#previewFormContext.ghostInvisible = true;
        /* --- */
        this.#detailEditorFormEl = this.shadowRoot.getElementById("detail-editor-form");
        this.#detailEditorFormEl.addEventListener("save", (event) => {
            if (this.#editPath.length) {
                const {data} = event;
                const formConfig = this.#getCurrentElementConfig();
                formConfig.allowsInvalid = data.allowsInvalid;
                if (data.submitButtonEnabled) {
                    if (data.submitButtonText) {
                        formConfig.submitButton = data.submitButtonText;
                    } else {
                        formConfig.submitButton = true;
                    }
                }
                if (data.resetButtonEnabled) {
                    if (data.resetButtonText) {
                        formConfig.resetButton = data.resetButtonText;
                    } else {
                        formConfig.resetButton = true;
                    }
                }
                formConfig.values = {...data.values};
                this.#buildPreview();
            }
        });
        /* --- */
        this.#detailEditorFormElementEl = this.shadowRoot.getElementById("detail-editor-form-element");
        this.#detailEditorFormElementEl.addEventListener("save", (event) => {
            if (this.#editPath.length) {
                const path = [...this.#editPath];
                const index = path.pop();
                const context = this.#getElementList(path);
                if (context[index].children != null && event.data.children != null) {
                    context[index] = {
                        ...event.data,
                        children: context[index].children,
                        data: {
                            id: context[index].data.id
                        }
                    };
                } else {
                    context[index] = {
                        ...event.data,
                        data: {
                            id: context[index].data.id
                        }
                    };
                }
                this.#structureEditorTreeEl.loadConfig(this.#config);
                this.#buildPreview();
            }
        });
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#structureEditorTreeEl.addEventListener("addForm", (event) => {
            const {path} = event;
            const calculatedIndex = this.#normalizeIndex(path, this.#config);
            const newElement = {
                elements: [],
                config: {
                    data: {
                        id: UGen.appUID("form")
                    }
                }
            };
            this.#config.forms.splice(calculatedIndex, 0, newElement);
            this.#editPath = [calculatedIndex];
            this.#structureEditorTreeEl.loadConfig(this.#config);
            this.#buildPreview();
            this.#structureEditorTreeEl.selectItemByPath(this.#editPath);
        });
        this.#structureEditorTreeEl.addEventListener("removeForm", (event) => {
            this.#detailEditorFormEl.classList.remove("active");
            this.#detailEditorFormElementEl.classList.remove("active");
            const {path} = event;
            const calculatedIndex = this.#normalizeIndex(path, this.#config);
            this.#config.forms.splice(calculatedIndex, 1);
            this.#editPath = [];
            this.#structureEditorTreeEl.loadConfig(this.#config);
            this.#detailEditorFormElementEl.loadFormElement({type: ""});
            this.#buildPreview();
            this.#structureEditorTreeEl.selectItemByPath(this.#editPath);
        });
        this.#structureEditorTreeEl.addEventListener("addElement", (event) => {
            const path = [...event.path];
            const index = path.pop();
            const context = this.#getElementList(path);
            const calculatedIndex = this.#normalizeIndex(index, context);
            const newElement = {
                type: "",
                data: {
                    id: UGen.appUID("form-element")
                }
            };
            context.splice(calculatedIndex, 0, newElement);
            this.#editPath = [...path, calculatedIndex];
            this.#structureEditorTreeEl.loadConfig(this.#config);
            this.#buildPreview();
            this.#structureEditorTreeEl.selectItemByPath(this.#editPath);
        });
        this.#structureEditorTreeEl.addEventListener("removeElement", (event) => {
            this.#detailEditorFormEl.classList.remove("active");
            this.#detailEditorFormElementEl.classList.remove("active");
            const path = [...event.path];
            const index = path.pop();
            const context = this.#getElementList(path);
            const calculatedIndex = this.#normalizeIndex(index, context);
            context.splice(calculatedIndex, 1);
            this.#structureEditorTreeEl.loadConfig(this.#config);
            this.#editPath = [];
            this.#detailEditorFormElementEl.loadFormElement({type: ""});
            this.#buildPreview();
        });
        this.#structureEditorTreeEl.addEventListener("editForm", (event) => {
            this.#detailEditorFormEl.classList.add("active");
            this.#detailEditorFormElementEl.classList.remove("active");
            this.#editPath = [...event.path];
            const config = this.#getCurrentElementConfig();
            this.#detailEditorFormEl.setData(config);
            this.#markElement();
        });
        this.#structureEditorTreeEl.addEventListener("editElement", (event) => {
            this.#detailEditorFormEl.classList.remove("active");
            this.#detailEditorFormElementEl.classList.add("active");
            this.#editPath = [...event.path];
            const config = this.#getCurrentElementConfig();
            this.#detailEditorFormElementEl.loadFormElement(config);
            this.#markElement();
        });
        /* --- */
        this.#previewClickHandler.set("click", (event) => {
            const targetEl = event.target;
            const dataId = targetEl.dataset["id"];
            if (dataId != null) {
                this.#structureEditorTreeEl.selectItemByKey(dataId);
            }
        });
    }

    #getElementList(path) {
        const p = [...path];
        const f = p.shift()
        let res = this.#config.forms;
        if (f != null) {
            res = res[f].elements;
            while (p.length) {
                res = res[p.shift()]?.children;
                if (res == null) {
                    throw new Error("found unexpected null value");
                }
            }
        }
        return res;
    }

    #buildPreview() {
        console.log(this.#config);
        const oldFormContainerEl = this.#previewEl.querySelector("emc-form-container");
        if (oldFormContainerEl != null) {
            this.#previewFormContext.unregisterFormContainer(oldFormContainerEl);
        }
        this.#previewEl.innerHTML = "";
        const formContainerEl = FormBuilder.build(this.#config);
        this.#previewFormContext.registerFormContainer(formContainerEl);
        this.#previewEl.append(formContainerEl);
        this.#previewClickHandler.switchTarget(formContainerEl);
        this.#markElement();
    }

    #markElement() {
        const oldMarkedEl = this.#previewEl.querySelector(".marked");
        if (oldMarkedEl != null) {
            oldMarkedEl.classList.remove("marked");
            oldMarkedEl.style.outline = "";
            oldMarkedEl.style.outlineOffset = "";
            oldMarkedEl.style.zIndex = "";
        }
        const config = this.#getCurrentElementConfig();
        if (config != null) {
            const newMarkedEl = this.#previewEl.querySelector(`[data-id="${config.data.id}"]`);
            if (newMarkedEl != null) {
                newMarkedEl.classList.add("marked");
                newMarkedEl.style.outline = "solid 4px red";
                newMarkedEl.style.outlineOffset = "-6px";
                newMarkedEl.style.zIndex = "1";
                newMarkedEl.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "start"
                });
            }
        }
    }

    #getCurrentElementConfig() {
        if (this.#editPath.length > 1) {
            const path = [...this.#editPath];
            const index = path.pop();
            const context = this.#getElementList(path);
            return context[index];
        }
        if (this.#editPath.length) {
            const index = this.#editPath[0];
            return this.#config.forms[index]?.config;
        }
    }

    #normalizeIndex(index, context) {
        if (index == null) {
            return 0;
        }
        if (index < 0) {
            return context.length + 1 + index;
        }
        return index;
    }

    setConfig(config) {
        config = deepClone(config)
        if (config.forms == null) {
            config = {
                forms: [{
                    elements: this.#convertElements(config),
                    config: {
                        data: {
                            id: UGen.appUID("form")
                        }
                    }
                }],
                hasHeader: false,
                hasFooter: false,
                defaultValues: {}
            }
        } else {
            for (const form of config.forms) {
                if (form.config == null) {
                    form.config = {data: {}};
                } else if (form.config.data == null) {
                    form.config.data = {};
                }
                form.config.data["id"] = UGen.appUID("form");
                form.elements = this.#convertElements(form.elements)
            }
        }
        this.#config = config;
        this.#structureEditorTreeEl.loadConfig(this.#config);
        this.#editPath = [];
        this.#detailEditorFormElementEl.loadFormElement({type: ""});
        this.#buildPreview();
    }

    #convertElements(elements) {
        if (Array.isArray(elements)) {
            for (const element of elements) {
                if (element.data == null) {
                    element.data = {};
                }
                element.data["id"] = UGen.appUID("form-element");
                if (element.children != null) {
                    element.children = this.#convertElements(element.children)
                }
            }
            return elements;
        } else {
            const res = [];
            for (const name in elements) {
                const data = {
                    name,
                    label: name,
                    ...elements[name],
                    type: this.#translateType(elements[name].type),
                    data: {
                        id: UGen.appUID("form-element")
                    }
                };
                if (elements[name].values != null && typeof elements[name].values === "object") {
                    const values = elements[name].values;
                    data.options = {};
                    if (Array.isArray(values)) {
                        for (const value of values) {
                            data.options[value] = value;
                        }
                    } else {
                        for (const key in values) {
                            data.options[key] = values[key];
                        }
                    }
                }
                res.push(data);
            }
            return res;
        }
    }

    #translateType(type) {
        switch (type) {
            case "button": return "ActionButton";
            case "check": return "SwitchInput";
            case "string": return "StringInput";
            case "number": return "NumberInput";
            case "range": return "RangeInput";
            case "color": return "ColorInput";
            case "password": return "PasswordInput";
            case "hotkey": return "HotkeyInput";
            case "choice": return "SearchSelect";
            case "list": return "ListSelect";
        }
        return type;
    }

    getConfig() {
        return deepClone(this.#config);
    }

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#structureEditorTreeEl.loadConfig(this.#config);
        this.#editPath = [];
        this.#detailEditorFormElementEl.loadFormElement({type: ""});
        this.#buildPreview();
    }

}

customElements.define("jse-form-editor", Editor);
