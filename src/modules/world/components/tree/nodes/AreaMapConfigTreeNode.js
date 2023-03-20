import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";

export default class AreaMapConfigTreeNode extends TreeNode {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("areaMapConfigSelect", {bubbles: true, cancelable: true});
            ev.element = this;
            ev.ref = this.ref;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area-map-config", AreaMapConfigTreeNode);
customElements.define("jse-tree-node-world-area-map-config", AreaMapConfigTreeNode);

