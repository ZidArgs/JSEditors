import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";

export default class AreaTreeNode extends TreeNode {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("areaSelect", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.ref = this.ref;
            this.dispatchEvent(ev);
        });
        this.addEventListener("contextmenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("areaMenu", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.ref = this.ref;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area", AreaTreeNode);
customElements.define("jse-tree-node-world-area", AreaTreeNode);

