import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";

export default class LocationTreeNode extends TreeNode {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("locationSelect", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.ref = this.ref;
            this.dispatchEvent(ev);
        });
        this.addEventListener("contextmenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("locationMenu", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.ref = this.ref;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-location", LocationTreeNode);
customElements.define("jse-tree-node-world-location", LocationTreeNode);

