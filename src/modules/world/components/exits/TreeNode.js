import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import WorldEditorTreeNode from "../../ui/tree/WorldEditorTreeNode.js";
import CtxMenu from "./CtxMenu.js";

export default class TreeNode_Exits extends WorldEditorTreeNode {

    constructor() {
        super();
        /* --- */
        this.setDefaultContextMenu(CtxMenu);
        this.addDefaultContextMenuHandler("add", (event) => {
            event.stopPropagation();
            const ev = new Event(`addEntity[${this.type}]`, {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                ref: this.ref
            };
            this.dispatchEvent(ev);
        });
    }

    get type() {
        return "exits";
    }

}

TreeNode.registerNodeType("jse-world::exits", TreeNode_Exits);
customElements.define("jse-world-tree-node-exits", TreeNode_Exits);
