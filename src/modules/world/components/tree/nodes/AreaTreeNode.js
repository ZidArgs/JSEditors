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
        /* --- */
        const subTreeEl = this.shadowRoot.getElementById("tree");
        subTreeEl.addEventListener("areaListItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index, list} = event;
            const ev = new Event("areaListItemSelect", {bubbles: true, cancelable: true});
            ev.element = element;
            ev.area = this.ref;
            ev.list = list;
            ev.index = index;
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areaListItemMenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index, list} = event;
            const ev = new Event("areaListItemMenu", {bubbles: true, cancelable: true});
            ev.element = element;
            ev.area = this.ref;
            ev.list = list;
            ev.index = index;
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areaMapConfigSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element} = event;
            const ev = new Event("areaMapConfigSelect", {bubbles: true, cancelable: true});
            ev.element = element;
            ev.area = this.ref;
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areaMapConfigSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element} = event;
            const ev = new Event("areaMapConfigSelect", {bubbles: true, cancelable: true});
            ev.element = element;
            ev.area = this.ref;
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area", AreaTreeNode);
customElements.define("jse-tree-node-world-area", AreaTreeNode);

