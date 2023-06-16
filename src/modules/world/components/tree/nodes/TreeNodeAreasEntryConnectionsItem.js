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

export default class TreeNodeAreasEntryConnectionsItem extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("areasEntryConnectionItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                index: targetIndex
            };
            this.dispatchEvent(ev);
        });
        this.addEventListener("contextmenu", (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.showDefaultContextMenu(event);
            return false;
        });
        /* --- */
    }

}

TreeNode.registerNodeType("editor-world-area-connection-item", TreeNodeAreasEntryConnectionsItem);
customElements.define("jse-tree-node-world-area-connectionitem", TreeNodeAreasEntryConnectionsItem);

