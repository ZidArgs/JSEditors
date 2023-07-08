import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin.js";
import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import {
    mix
} from "/emcJS/util/Mixin.js";
import {
    addEventListenerForMultiType
} from "/emcJS/util/helper/Event.js";
import TreeCtxMenuAreaEntryList from "../../contextmenu/TreeCtxMenuAreaEntryList.js";
import AreaListEntryModal from "../../modal/AreaListEntryModal.js";

const BaseClass = mix(
    TreeNode
).with(
    ContextMenuManagerMixin
);

export default class TreeNodeCollectionEntryList extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("contentclick", (event) => {
            event.stopPropagation();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("collectionEntryListSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                index: targetIndex
            };
            this.dispatchEvent(ev);
        });
        this.addEventListener("contentcontextmenu", (event) => {
            event.stopPropagation();
            this.showDefaultContextMenu(event);
            return false;
        });
        /* --- */
        this.setDefaultContextMenu(TreeCtxMenuAreaEntryList);
        this.addDefaultContextMenuHandler("addelementtop", () => {
            const dialogEl = new AreaListEntryModal();
            dialogEl.addEventListener("submit", (event) => {
                const {type, ref} = event.data;
                const ev = new Event("collectionListAddElementTop", {bubbles: true, cancelable: true, composed: true});
                ev.data = {
                    element: this,
                    type,
                    ref,
                    list: this.ref
                };
                this.dispatchEvent(ev);
            });
            dialogEl.show();
        });
        this.addDefaultContextMenuHandler("addelementbottom", () => {
            const dialogEl = new AreaListEntryModal();
            dialogEl.addEventListener("submit", (event) => {
                const {type, ref} = event.data;
                const ev = new Event("collectionListAddElementBottom", {bubbles: true, cancelable: true, composed: true});
                ev.data = {
                    element: this,
                    type,
                    ref,
                    list: this.ref
                };
                this.dispatchEvent(ev);
            });
            dialogEl.show();
        });
        /* --- */
        const subTreeEl = this.shadowRoot.getElementById("tree");
        subTreeEl.addEventListener("collectionEntryListItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index} = event.data;
            const ev = new Event("collectionEntryListItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                list: this.ref
            };
            this.dispatchEvent(ev);
        });
        /* --- */
        addEventListenerForMultiType(subTreeEl, [
            "collectionListAddElementBefore",
            "collectionListAddElementAfter",
            "collectionListRemoveElement"
        ], (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index, type, ref} = event.data;
            const ev = new Event(event.type, {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                type,
                ref,
                list: this.ref
            };
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-collection-entry-list", TreeNodeCollectionEntryList);
customElements.define("jse-tree-node-world-collection-entry-list", TreeNodeCollectionEntryList);
