import CustomElement from "/emcJS/ui/element/CustomElement.js";
import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin.js";
import {
    mix
} from "/emcJS/util/Mixin.js";
import "/emcJS/ui/tree/Tree.js";
// import StructureTreeContextMenuForm from "./contextmenu/StructureTreeContextMenuForm.js";
// import StructureTreeContextMenuFormElement from "./contextmenu/StructureTreeContextMenuFormElement.js";
// import StructureTreeContextMenuFormElementWithChild from "./contextmenu/StructureTreeContextMenuFormElementWithChild.js";
import TPL from "./StructureEditorTree.js.html" assert {type: "html"};
import STYLE from "./StructureEditorTree.js.css" assert {type: "css"};

const BaseClass = mix(
    CustomElement
).with(
    ContextMenuManagerMixin
);

export default class StructureEditorTree extends BaseClass {

    #treeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.addEventListener("contextmenusclosed", () => {
            this.#treeEl.markItemByPathForMenu();
        });
        /* --- */
        this.#treeEl = this.shadowRoot.getElementById("tree");
        this.#treeEl.addEventListener("select", (event) => {
            if (!event.data.isSelected) {
                event.preventDefault();
            }
        });
        this.#treeEl.addEventListener("menu", (event) => {
            const {path, element} = event.data;
            this.#treeEl.markItemByPathForMenu(path);
            if (path.length === 1) {
                this.showContextMenu("form", event, {path});
            } else if (path.length > 1) {
                if (element.forceCollapsible) {
                    this.showContextMenu("elementWithChild", event, {path});
                } else {
                    this.showContextMenu("element", event, {path});
                }
            }
            event.stopPropagation();
            event.preventDefault();
        });
    }

    selectItemByPath(path) {
        this.#treeEl.forcePathExpanded(path.slice(0, -1));
        this.#treeEl.selectItemByPath(path);
    }

    selectItemByKey(key) {
        const treeNodeEl = this.#treeEl.querySelector(`[ref="${key}"]`);
        treeNodeEl.click();
    }

    forcePathExpanded(path) {
        this.#treeEl.forcePathExpanded(path);
    }

    loadConfig(config) {
        this.#treeEl.loadConfig(config);
    }

}

customElements.define("jse-world-editor-structure-tree", StructureEditorTree);
