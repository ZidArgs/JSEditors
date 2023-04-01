import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";

export default class AreaListItemTreeNode extends TreeNode {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("areaListItemSelect", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.index = targetIndex;
            this.dispatchEvent(ev);
        });
        this.addEventListener("contextmenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("areaListItemMenu", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.index = targetIndex;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area-list-item", AreaListItemTreeNode);
customElements.define("jse-tree-node-world-area-listitem", AreaListItemTreeNode);

