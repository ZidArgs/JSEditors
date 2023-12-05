import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin.js";
import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import {
    mix
} from "/emcJS/util/Mixin.js";

const BaseClass = mix(
    TreeNode
).with(
    ContextMenuManagerMixin
);

export default class TreeNode_Areas extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("contentclick", (event) => this.#select(event));
        this.addEventListener("contentcontextmenu", (event) => this.#contextMenu(event));
        /* --- */
        const subTreeEl = this.shadowRoot.getElementById("tree");
        subTreeEl.addEventListener("select", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("select", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                ...event.data,
                area: this.ref
            };
            ev.treePath = [
                targetIndex,
                ...event.treePath
            ];
            this.dispatchEvent(ev);
        });
    }

    #select(event) {
        event.stopPropagation();
        const targetIndex = Array.from(this.parentElement.children).indexOf(this);
        const ev = new Event("select_Areas", {bubbles: true, cancelable: true, composed: true});
        ev.data = {
            element: this,
            index: targetIndex
        };
        this.dispatchEvent(ev);
    }

    #contextMenu(event) {
        event.stopPropagation();
        this.showDefaultContextMenu(event);
        return false;
    }

}

TreeNode.registerNodeType("jse-world::areas", TreeNode_Areas);
customElements.define("jse-world-tree-node-areas", TreeNode_Areas);
