import ContextMenuManagerMixin from "@emcjs/fe/ui/mixin/ContextMenuManagerMixin.js";
import TreeNode from "@emcjs/fe/ui/tree/components/TreeNode.js";
import CtxMenu from "./CtxMenu.js";

export default class TreeNode_Property extends ContextMenuManagerMixin(TreeNode) {

    constructor() {
        super();
        /* --- */
        this.setDefaultContextMenu(CtxMenu);
        this.addDefaultContextMenuHandler("add", (event) => {
            event.stopPropagation();
            const ev = new Event(`addEntity[${this.type}]`, {
                bubbles: true,
                cancelable: true,
                composed: true
            });
            ev.data = {
                element: this,
                ref: this.ref
            };
            this.dispatchEvent(ev);
        });
    }

    get type() {
        return "properties";
    }

}

TreeNode.registerNodeType("jse-tree-node::properties", TreeNode_Property);
customElements.define("jse-tree-node-properties", TreeNode_Property);
