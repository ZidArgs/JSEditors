import CustomElement from "@emcjs/fe/ui/element/CustomElement.js";
import EventTargetManager from "@emcjs/core/util/event/EventTargetManager.js";
import LogicOperatorRegistry from "@emcjs/core/data/registry/LogicOperatorRegistry.js";
import {
    appUID
} from "@emcjs/core/util/helper/UniqueGenerator.js";
import {
    getFromTreeConfigByRefPath
} from "@emcjs/fe/util/tree/TreeConfig.js";
import FormBuilder from "@emcjs/fe/util/form/FormBuilder.js";
import FormContext from "@emcjs/fe/util/form/context/FormContext.js";
import {
    deepClone
} from "@emcjs/core/util/helper/DeepClone.js";
import {
    scrollIntoViewIfNeeded
} from "@emcjs/fe/util/node/Scroll.js";
import DefaultFromConfigDataConverter from "./util/DefaultFromConfigDataConverter.js";
import "@emcjs/fe/ui/container/CaptionPanel.js";
import "@emcjs/fe/ui/container/CollapsePanel.js";
import "@emcjs/fe/ui/form/FormContainer.js";
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

LogicOperatorRegistry.setGroupCaption("formFields", "Form Fields");

// FIXME element config panell is not updating or dispatching change properly
// TODO handle elements more like the emcjs element demo, dont expose FormField as placeable element
// TODO add header/footer forms node
// TODO make current first form node be content forms node
class FormEditor extends CustomElement {

    #configDataConverter;

    #config = deepClone(DEFAULT_CONFIG);

    #editPath = [];

    #editRefPath = [];

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
                this.dispatchEvent(new Event("change"));
            }
        });
        /* --- */
        this.#detailEditorFormElementEl = this.shadowRoot.getElementById("detail-editor-form-element");
        this.#detailEditorFormElementEl.addEventListener("save", (event) => {
            if (this.#editPath.length) {
                const path = [...this.#editPath];
                const index = path.pop();
                const context = this.#getElementList(path);
                this.#checkDeleteLogicOperator(context[index]);
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
                this.#setLogicOperator(event.data);
                this.#reloadTreeAtPath(this.#editRefPath);
                this.#buildPreview();
                this.dispatchEvent(new Event("change"));
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
                        id: appUID("form")
                    }
                }
            };
            this.#config.forms.splice(calculatedIndex, 0, newElement);
            this.#editPath = [calculatedIndex];
            this.#reloadTree();
            this.#buildPreview();
            this.#structureEditorTreeEl.selectItemByPath(this.#editPath);
            this.dispatchEvent(new Event("change"));
        });
        this.#structureEditorTreeEl.addEventListener("removeForm", (event) => {
            this.#detailEditorFormEl.classList.remove("active");
            this.#detailEditorFormElementEl.classList.remove("active");
            const {path} = event;
            const calculatedIndex = this.#normalizeIndex(path, this.#config);
            this.#config.forms.splice(calculatedIndex, 1);
            this.#editPath = [];
            this.#reloadTree();
            this.#buildPreview();
            this.#detailEditorFormElementEl.setData({type: ""});
            this.#structureEditorTreeEl.selectItemByPath(this.#editPath);
            this.dispatchEvent(new Event("change"));
        });
        this.#structureEditorTreeEl.addEventListener("addElement", (event) => {
            const path = [...event.path];
            const index = path.pop();
            const context = this.#getElementList(path);
            const calculatedIndex = this.#normalizeIndex(index, context);
            const newElement = {
                type: "",
                data: {
                    id: appUID("form-element")
                }
            };
            context.splice(calculatedIndex, 0, newElement);
            this.#editPath = [...path, calculatedIndex];
            const refPath = [...event.refPath];
            refPath.pop();
            this.#reloadTreeAtPath(refPath);
            this.#buildPreview();
            this.#structureEditorTreeEl.selectItemByPath(this.#editPath);
            this.dispatchEvent(new Event("change"));
        });
        this.#structureEditorTreeEl.addEventListener("removeElement", (event) => {
            this.#detailEditorFormEl.classList.remove("active");
            this.#detailEditorFormElementEl.classList.remove("active");
            const path = [...event.path];
            const index = path.pop();
            const context = this.#getElementList(path);
            const calculatedIndex = this.#normalizeIndex(index, context);
            this.#checkDeleteLogicOperator(context[calculatedIndex]);
            context.splice(calculatedIndex, 1);
            this.#editPath = [];
            this.#detailEditorFormElementEl.setData({type: ""});
            const refPath = [...event.refPath];
            refPath.pop();
            this.#reloadTreeAtPath(refPath);
            this.#buildPreview();
            this.dispatchEvent(new Event("change"));
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
            this.#detailEditorFormElementEl.setData(config);
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
        const f = p.shift();
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
        }
        const config = this.#getCurrentElementConfig();
        if (config != null) {
            const newMarkedEl = this.#previewEl.querySelector(`[data-id="${config.data.id}"]`);
            if (newMarkedEl != null) {
                newMarkedEl.classList.add("marked");
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
        this.#detailEditorFormElementEl.setData({type: ""});
        this.#buildPreview();
        this.#initLogicOperators();
    }

    getConfig() {
        return this.configDataConverter.translateGetConfig(this.#config);
    }

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#reloadTree();
        this.#editPath = [];
        this.#detailEditorFormElementEl.setData({type: ""});
        this.#buildPreview();
        this.#initLogicOperators();
    }

    #reloadTree() {
        const treeConfig = this.configDataConverter.extractTreeStructure(this.#config);
        this.#structureEditorTreeEl.loadConfig(treeConfig);
    }

    #reloadTreeAtPath(refPath = []) {
        this.#editRefPath = [...refPath];
        const treeConfig = this.configDataConverter.extractTreeStructure(this.#config);
        const subTreeConfig = getFromTreeConfigByRefPath(treeConfig, refPath);
        this.#structureEditorTreeEl.loadConfigAtRefPath(refPath, subTreeConfig);
    }

    #initLogicOperators() {
        for (const form of this.#config.forms) {
            this.#loadLogicOperators(form.elements);
        }
    }

    #loadLogicOperators(elements) {
        for (const el of elements) {
            this.#setLogicOperator(el);
            if (el.children != null) {
                this.#loadLogicOperators(el.children);
            }
        }
    }

    #setLogicOperator(config) {
        if (config.name) {
            if (config.options) {
                LogicOperatorRegistry.setOperator(config.name, {
                    type: "state",
                    options: config.options,
                    value: Object.keys(config.options)[0]
                });
                LogicOperatorRegistry.linkOperator(config.name, "formFields");
            } else {
                LogicOperatorRegistry.setOperator(config.name, {
                    type: "value"
                });
                LogicOperatorRegistry.linkOperator(config.name, "formFields");
            }
        }
    }

    #checkDeleteLogicOperator(config) {
        if (config.name) {
            // TODO check if last element of name
            LogicOperatorRegistry.deleteOperator(config.name);
        }
    }

}

customElements.define("jse-form-editor", FormEditor);
