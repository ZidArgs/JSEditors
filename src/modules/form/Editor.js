import CustomElement from "/emcJS/ui/element/CustomElement.js";
import UGen from "/emcJS/util/UniqueGenerator.js";
import {
    isEqual
} from "/emcJS/util/helper/Comparator.js";
import "/emcJS/ui/container/CaptionPanel.js";
import "/emcJS/ui/container/CollapsePanel.js";
import "./components/StructureEditor.js";
import "./components/DetailEditor.js";
import TPL from "./Editor.js.html" assert {type: "html"};
import STYLE from "./Editor.js.css" assert {type: "css"};

class Editor extends CustomElement {

    #config = [];

    #editPath = [];

    #detailEditorEl;

    #structureEditorEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
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
                        _elID: context[index]._elID
                    };
                } else {
                    context[index] = {
                        ...event.data,
                        _elID: context[index]._elID
                    };
                }
                this.#structureEditorEl.loadConfig(this.#config, []);
                // this.#structureEditorEl.loadConfig(event.data, [...this.#editPath]);
                console.log(this.#config);
            }
        });
        /* --- */
        this.#structureEditorEl = this.shadowRoot.getElementById("structure-editor");
        this.#structureEditorEl.addEventListener("add", (event) => {
            const path = [...event.elPath];
            const index = path.pop() + 1;
            const context = this.#getElementList(path);
            const newElement = {
                type: "",
                _elID: UGen.appUID("form-element")
            };
            context.splice(index, 0, newElement);
            this.#editPath = [...path, index];
            this.#structureEditorEl.loadConfig(this.#config, []);
            // this.#structureEditorEl.loadConfig(context, [...event.path]);
            this.#detailEditorEl.loadFormElement(newElement, true);
            console.log(this.#config);
        });
        this.#structureEditorEl.addEventListener("remove", (event) => {
            const path = [...event.elPath];
            const index = path.pop();
            const context = this.#getElementList(path);
            context.splice(index, 1);
            this.#structureEditorEl.loadConfig(this.#config, []);
            // this.#structureEditorEl.loadConfig(context, [...event.path]);
            this.#editPath = [];
            this.#detailEditorEl.loadFormElement({type: ""});
            console.log(this.#config);
        });
        this.#structureEditorEl.addEventListener("edit", (event) => {
            const path = [...event.elPath];
            const index = path.pop();
            const context = this.#getElementList(path);
            this.#editPath = [...path, index];
            const config = context[index];
            this.#detailEditorEl.loadFormElement(config);
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

}

customElements.define("jse-form-editor", Editor);
