import CustomElement from "/emcJS/ui/element/CustomElement.js";
import EventTargetManager from "/emcJS/util/event/EventTargetManager.js";
import UGen from "/emcJS/util/UniqueGenerator.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import "/emcJS/ui/container/CaptionPanel.js";
import "/emcJS/ui/container/CollapsePanel.js";
import "/emcJS/ui/form/FormContainer.js";
import "./components/StructureEditor.js";
import "./components/StructureEditorTree.js";
import "./components/DetailEditor.js";
import TPL from "./Editor.js.html" assert {type: "html"};
import STYLE from "./Editor.js.css" assert {type: "css"};

class Editor extends CustomElement {

    #config = [];

    #editPath = [];

    #detailEditorEl;

    #previewEl;

    #previewFormContext = new FormContext();

    #previewClickHandler = new EventTargetManager();

    #structureEditorEl;

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
                this.#structureEditorEl.loadConfig(this.#config, []);
                this.#structureEditorTreeEl.loadConfig({
                    forms: [{
                        data: {
                            id: "0"
                        },
                        elements: this.#config
                    }]
                });
                console.log(this.#config);
                this.#buildPreview();
            }
        });
        /* --- */
        this.#structureEditorEl = this.shadowRoot.getElementById("structure-editor");
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#structureEditorEl.addEventListener("addform", () => {
            const newElement = {
                elements: [],
                data: {
                    id: UGen.appUID("form")
                }
            };
            this.#config.push(newElement);
            this.#editPath = [this.#config.length - 1];
            this.#structureEditorEl.loadConfig(this.#config);
            this.#structureEditorTreeEl.loadConfig({
                forms: [{
                    data: {
                        id: "0"
                    },
                    elements: this.#config
                }]
            });
            // TODO switch to form-config form (in place of detail editor)
            // this.#detailEditorEl.loadFormElement(newElement, true);
            console.log(this.#config);
            this.#buildPreview();
        });

        this.#structureEditorEl.addEventListener("add", (event) => {
            const path = [...event.elPath];
            const index = path.pop() + 1;
            const context = this.#getElementList(path);
            const newElement = {
                type: "",
                data: {
                    id: UGen.appUID("form-element")
                }
            };
            context.splice(index, 0, newElement);
            this.#editPath = [...path, index];
            this.#structureEditorEl.loadConfig(this.#config, []);
            this.#structureEditorTreeEl.loadConfig({
                forms: [{
                    data: {
                        id: "0"
                    },
                    elements: this.#config
                }]
            });
            this.#detailEditorEl.loadFormElement(newElement, true);
            console.log(this.#config);
            this.#buildPreview();
        });
        this.#structureEditorEl.addEventListener("remove", (event) => {
            const path = [...event.elPath];
            const index = path.pop();
            const context = this.#getElementList(path);
            context.splice(index, 1);
            this.#structureEditorEl.loadConfig(this.#config, []);
            this.#structureEditorTreeEl.loadConfig({
                forms: [{
                    data: {
                        id: "0"
                    },
                    elements: this.#config
                }]
            });
            this.#editPath = [];
            this.#detailEditorEl.loadFormElement({type: ""});
            console.log(this.#config);
            this.#buildPreview();
        });
        this.#structureEditorEl.addEventListener("edit", (event) => {
            this.#editPath = [...event.elPath];
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
        /* --- */
        const catcherEl = this.shadowRoot.getElementById("catcher");
        catcherEl.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        catcherEl.addEventListener("reset", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    }

    #getElementList(path) {
        const p = [...path];
        let res = this.#config;
        while (p.length) {
            res = res[p.shift()]?.children;
            if (res == null) {
                throw new Error("found unexpected null value");
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
        const formContainerEl = FormBuilder.build({
            forms: [{
                elements: this.#config
            }]
        });
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
        const newMarkedEl = this.#previewEl.querySelector(`[data-id="${config.data.id}"]`);
        if (newMarkedEl != null) {
            newMarkedEl.classList.add("marked");
            newMarkedEl.style.outline = "solid 2px red";
        }
    }

    #getCurrentElementConfig() {
        const path = [...this.#editPath];
        const index = path.pop();
        const context = this.#getElementList(path);
        return context[index];
    }

}

customElements.define("jse-form-editor", Editor);
