import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin.js";
import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import {
    mix
} from "/emcJS/util/Mixin.js";
import {
    addEventListenerForMultiType
} from "/emcJS/util/helper/Event.js";
import CtxMenu_Areas_Entry_Lists_List from "../areas_entry_lists_list/CtxMenu.js";
import AreaListEntryModal from "../../ui/modal/AreaListEntryModal.js";

const BaseClass = mix(
    TreeNode
).with(
    ContextMenuManagerMixin
);

export default class TreeNode_Collections_Entry_List extends BaseClass {

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
        this.setDefaultContextMenu(CtxMenu_Areas_Entry_Lists_List);
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

TreeNode.registerNodeType("jse-world::collections-entry-list", TreeNode_Collections_Entry_List);
customElements.define("jse-world-tree-node-collections-entry-list", TreeNode_Collections_Entry_List);
