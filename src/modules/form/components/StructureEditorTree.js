import CustomElement from "/emcJS/ui/element/CustomElement.js";
import "/emcJS/ui/tree/Tree.js";
import TPL from "./StructureEditorTree.js.html" assert {type: "html"};
import STYLE from "./StructureEditorTree.js.css" assert {type: "css"};

export default class StructureEditorTree extends CustomElement {

    #treeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#treeEl = this.shadowRoot.getElementById("tree");
        this.#treeEl.addEventListener("select", (event) => {
            const {element, path, refPath} = event;
            console.log("tree select", element, path, refPath);
        });
        this.#treeEl.addEventListener("menu", (event) => {
            const {element, path, refPath} = event;
            console.log("tree menu", element, path, refPath);
        });
        /* --- */
        const newButtonEl = this.shadowRoot.getElementById("add");
        newButtonEl.addEventListener("click", () => {
            const event = new Event("addform", {bubbles: true, cancelable: true});
            this.dispatchEvent(event);
        });
    }

    loadConfig(config) {
        const tree = {};
        for (const form of config.forms) {
            tree[form.data.id] = {
                label: `Form (${form.data.id})`,
                children: this.#translateFormConfig(form.elements)
            };
        }
        this.#treeEl.loadConfig(tree);
    }

    #translateFormConfig(elements) {
        const result = {};
        for (const element of elements) {
            const {children, ...params} = element;
            const label = this.#extractLabel(params);
            if (children != null) {
                result[element.data.id] = {
                    label,
                    children: this.#translateFormConfig(children)
                };
            } else {
                result[element.data.id] = {
                    label
                };
            }
        }
        return result;
    }

    #extractLabel(params) {
        const {type, label, name, id} = params;
        let res = type || "{new}";
        if (label) {
            res += ` - ${label}`;
        }
        if (name) {
            res += ` [${name}]`;
        }
        if (id) {
            res += ` #${id}`;
        }
        return res;
    }

}

customElements.define("jse-form-editor-structure-tree", StructureEditorTree);
