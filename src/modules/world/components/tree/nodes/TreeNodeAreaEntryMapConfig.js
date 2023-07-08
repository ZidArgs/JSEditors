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

export default class TreeNodeAreaEntryMapConfig extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("contentclick", (event) => {
            event.stopPropagation();
            const ev = new Event("areaEntryMapConfigSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                ref: this.ref
            };
            this.dispatchEvent(ev);
        });
        this.addEventListener("contentcontextmenu", (event) => {
            event.stopPropagation();
            this.showDefaultContextMenu(event);
            return false;
        });
        /* --- */
    }

}

TreeNode.registerNodeType("editor-world-area-entry-map-config", TreeNodeAreaEntryMapConfig);
customElements.define("jse-tree-node-world-area-entry-map-config", TreeNodeAreaEntryMapConfig);
