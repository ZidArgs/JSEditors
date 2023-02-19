import CustomElement from "/emcJS/ui/element/CustomElement.js";
import EventTargetManager from "/emcJS/util/event/EventTargetManager.js";
import UGen from "/emcJS/util/UniqueGenerator.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import {
    scrollIntoViewIfNeeded
} from "/emcJS/util/helper/ui/Scroll.js";
import DefaultFromConfigDataConverter from "./util/DefaultFromConfigDataConverter.js";
import "/emcJS/ui/container/CaptionPanel.js";
import "/emcJS/ui/container/CollapsePanel.js";
import "/emcJS/ui/form/FormContainer.js";
import "./components/tree/StructureEditorTree.js";
import "./components/FormDetailEditor.js";
import "./components/FormElementDetailEditor.js";
import TPL from "./FormEditor.js.html" assert {type: "html"};
import STYLE from "./FormEditor.js.css" assert {type: "css"};

const DEFAULT_CONFIG_DATA_CONVERTER = new DefaultFromConfigDataConverter();

const DEFAULT_CONFIG = {
    forms: [],
    hasHeader: false,
    hasFooter: false,
    defaultValues: {}
};

class FormEditor extends CustomElement {

    #configDataConverter;

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
                this.#reloadTree();
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
            this.#reloadTree();
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
            this.#reloadTree();
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
            this.#reloadTree();
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
            this.#reloadTree();
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

    set configDataConverter(value) {
        if (value instanceof DefaultFromConfigDataConverter) {
            this.#configDataConverter = value;
        } else {
            this.#configDataConverter = null;
        }
    }

    get configDataConverter() {
        return this.#configDataConverter ?? DEFAULT_CONFIG_DATA_CONVERTER;
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
                if (newMarkedEl instanceof HTMLFormElement) {
                    scrollIntoViewIfNeeded(newMarkedEl, {
                        behavior: "smooth",
                        block: "start"
                    });
                } else {
                    scrollIntoViewIfNeeded(newMarkedEl, {
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
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
        this.#config = this.configDataConverter.translateSetConfig(config);
        this.#reloadTree();
        this.#editPath = [];
        this.#detailEditorFormElementEl.loadFormElement({type: ""});
        this.#buildPreview();
    }

    getConfig() {
        return this.configDataConverter.translateGetConfig(this.#config);
    }

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#reloadTree();
        this.#editPath = [];
        this.#detailEditorFormElementEl.loadFormElement({type: ""});
        this.#buildPreview();
    }

    #reloadTree() {
        this.#structureEditorTreeEl.loadConfig(this.configDataConverter.extractTreeStructure(this.#config));
    }

}

customElements.define("jse-form-editor", FormEditor);
