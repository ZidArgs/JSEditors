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
import "./components/DetailEditor.js";
import TPL from "./Editor.js.html" assert {type: "html"};
import STYLE from "./Editor.js.css" assert {type: "css"};

class Editor extends CustomElement {

    #config = {
        forms: [],
        contentMask: "0px",
        hasHeader: false,
        hasFooter: false,
        defaultValues: {}
    };

    #editPath = [];

    #detailEditorEl;

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
        /* --- */
        this.#detailEditorEl = this.shadowRoot.getElementById("detail-editor");
        this.#detailEditorEl.addEventListener("save", (event) => {
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
                data: {
                    id: UGen.appUID("form")
                }
            };
            this.#config.forms.splice(calculatedIndex, 0, newElement);
            this.#editPath = [calculatedIndex];
            this.#structureEditorTreeEl.loadConfig(this.#config);
            // TODO switch to form-config form (in place of detail editor)
            // this.#detailEditorEl.loadFormElement(newElement, true);
            this.#buildPreview();
            this.#structureEditorTreeEl.selectItemByPath(this.#editPath);
        });
        this.#structureEditorTreeEl.addEventListener("removeForm", (event) => {
            const {path} = event;
            const calculatedIndex = this.#normalizeIndex(path, this.#config);
            this.#config.forms.splice(calculatedIndex, 1);
            this.#editPath = [];
            this.#structureEditorTreeEl.loadConfig(this.#config);
            this.#detailEditorEl.loadFormElement({type: ""});
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
            const path = [...event.path];
            const index = path.pop();
            const context = this.#getElementList(path);
            const calculatedIndex = this.#normalizeIndex(index, context);
            context.splice(calculatedIndex, 1);
            this.#structureEditorTreeEl.loadConfig(this.#config);
            this.#editPath = [];
            this.#detailEditorEl.loadFormElement({type: ""});
            this.#buildPreview();
        });
        this.#structureEditorTreeEl.addEventListener("editElement", (event) => {
            this.#editPath = [...event.path];
            const config = this.#getCurrentElementConfig();
            this.#detailEditorEl.loadFormElement(config);
            this.#markElement();
        });
        /* --- */
        this.#previewClickHandler.set("click", (event) => {
            const targetEl = event.target;
            const dataId = targetEl.dataset["id"];
            console.log("dataId", dataId);
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
        }
        const config = this.#getCurrentElementConfig();
        if (config != null) {
            const newMarkedEl = this.#previewEl.querySelector(`[data-id="${config.data.id}"]`);
            if (newMarkedEl != null) {
                newMarkedEl.classList.add("marked");
                newMarkedEl.style.outline = "solid 2px red";
                newMarkedEl.scrollIntoViewIfNeeded();
            }
        }
    }

    #getCurrentElementConfig() {
        const path = [...this.#editPath];
        const index = path.pop();
        const context = this.#getElementList(path);
        return context[index];
    }

    #normalizeIndex(index, context) {
        return index < 0 ? context.length + 1 + index : index;
    }

    setConfig(config) {
        config = deepClone(config)
        if (config.forms == null) {
            config = {
                forms: [{
                    elements: this.#convertElements(config),
                    data: {
                        id: UGen.appUID("form")
                    }
                }],
                contentMask: "0px",
                hasHeader: false,
                hasFooter: false,
                defaultValues: {}
            }
        } else {
            for (const form of config.forms) {
                form.data["id"] = UGen.appUID("form");
                form.elements = this.#convertElements(form.elements)
            }
        }
        this.#config = config;
        this.#structureEditorTreeEl.loadConfig(this.#config);
        this.#editPath = [];
        this.#detailEditorEl.loadFormElement({type: ""});
        this.#buildPreview();
    }

    #convertElements(elements) {
        if (Array.isArray(elements)) {
            for (const element of elements) {
                element.data["id"] = UGen.appUID("form-element");
                if (element.children != null) {
                    element.children = this.#convertElements(element.children)
                }
            }
            return elements;
        } else {
            const res = [];
            for (const name in elements) {
                res.push({
                    name,
                    label: name,
                    ...elements[name],
                    type: this.#translateType(elements[name].type),
                    data: {
                        id: UGen.appUID("form-element")
                    }
                });
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

}

customElements.define("jse-form-editor", Editor);
