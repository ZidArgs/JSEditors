import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";

export default class ExitTreeNode extends TreeNode {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("exitSelect", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.ref = this.ref;
            this.dispatchEvent(ev);
        });
        this.addEventListener("contextmenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("exitMenu", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.ref = this.ref;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-exit", ExitTreeNode);
customElements.define("jse-tree-node-world-exit", ExitTreeNode);

