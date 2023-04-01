import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";

export default class AreaListItemTreeNode extends TreeNode {

    constructor() {
        super();
        /* --- */
        const subTreeEl = this.shadowRoot.getElementById("tree");
        subTreeEl.addEventListener("areaListItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index} = event;
            const ev = new Event("areaListItemSelect", {bubbles: true, cancelable: true});
            ev.element = element;
            ev.list = this.ref;
            ev.index = index;
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areaListItemMenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index} = event;
            const ev = new Event("areaListItemMenu", {bubbles: true, cancelable: true});
            ev.element = element;
            ev.list = this.ref;
            ev.index = index;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area-list", AreaListItemTreeNode);
customElements.define("jse-tree-node-world-area-list", AreaListItemTreeNode);

