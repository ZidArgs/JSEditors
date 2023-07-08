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

export default class TreeNodeCollectionEntry extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("contentclick", (event) => {
            event.stopPropagation();
            const ev = new Event("collectionEntrySelect", {bubbles: true, cancelable: true, composed: true});
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
        subTreeEl.addEventListener("collectionEntryConnectionsItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index} = event.data;
            const ev = new Event("collectionEntryConnectionsItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                collection: this.ref
            };
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("collectionEntryListItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index, list} = event.data;
            const ev = new Event("collectionEntryListItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                list,
                collection: this.ref
            };
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("collectionEntryMapConfigSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element} = event.data;
            const ev = new Event("collectionEntryMapConfigSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                collection: this.ref
            };
            this.dispatchEvent(ev);
        });
        /* --- */
        addEventListenerForMultiType(subTreeEl, [
            "collectionListAddElementTop",
            "collectionListAddElementBottom",
            "collectionListAddElementBefore",
            "collectionListAddElementAfter",
            "collectionListRemoveElement"
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
                collection: this.ref
            };
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-collection-entry", TreeNodeCollectionEntry);
customElements.define("jse-tree-node-world-collection-entry", TreeNodeCollectionEntry);
