import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin.js";
import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import {
    mix
} from "/emcJS/util/Mixin.js";
import {
    addEventListenerForMultiType
} from "/emcJS/util/helper/Event.js";

const BaseClass = mix(
    TreeNode
).with(
    ContextMenuManagerMixin
);

export default class TreeNodeAreaEntry extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("contentclick", (event) => {
            event.stopPropagation();
            const ev = new Event("areaEntrySelect", {bubbles: true, cancelable: true, composed: true});
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
        const subTreeEl = this.shadowRoot.getElementById("tree");
        subTreeEl.addEventListener("areaEntryConnectionsItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index} = event.data;
            const ev = new Event("areaEntryConnectionsItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                area: this.ref
            };
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areaEntryListItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index, list} = event.data;
            const ev = new Event("areaEntryListItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                list,
                area: this.ref
            };
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areaEntryMapConfigSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element} = event.data;
            const ev = new Event("areaEntryMapConfigSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                area: this.ref
            };
            this.dispatchEvent(ev);
        });
        /* --- */
        addEventListenerForMultiType(subTreeEl, [
            "areaListAddElementTop",
            "areaListAddElementBottom",
            "areaListAddElementBefore",
            "areaListAddElementAfter",
            "areaListRemoveElement"
        ], (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index, type, ref, list} = event.data;
            const ev = new Event(event.type, {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                type,
                ref,
                list,
                area: this.ref
            };
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area-entry", TreeNodeAreaEntry);
customElements.define("jse-tree-node-world-area-entry", TreeNodeAreaEntry);
