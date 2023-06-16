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

export default class TreeNodeLocationsEntry extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("locationsEntrySelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                ref: this.ref
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

TreeNode.registerNodeType("editor-world-location", TreeNodeLocationsEntry);
customElements.define("jse-tree-node-world-location", TreeNodeLocationsEntry);

