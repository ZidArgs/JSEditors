import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";

export default class AreaConnectionItemTreeNode extends TreeNode {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("areaConnectionItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.element = this;
            ev.index = targetIndex;
            this.dispatchEvent(ev);
        });
        this.addEventListener("contextmenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("areaConnectionItemMenu", {bubbles: true, cancelable: true, composed: true});
            ev.element = this;
            ev.index = targetIndex;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area-connection-item", AreaConnectionItemTreeNode);
customElements.define("jse-tree-node-world-area-connectionitem", AreaConnectionItemTreeNode);

