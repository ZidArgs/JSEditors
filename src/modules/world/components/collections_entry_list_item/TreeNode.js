import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin";
import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import {
    mix
} from "/emcJS/util/Mixin.js";
import CtxMenu_Areas_Entry_Lists_List_Item from "../areas_entry_lists_list_item/CtxMenu.js";
import AreaListEntryModal from "../../ui/modal/AreaListEntryModal.js";

const BaseClass = mix(
    TreeNode
).with(
    ContextMenuManagerMixin
);

export default class TreeNode_Collections_Entry_List_Item extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("contentclick", (event) => {
            event.stopPropagation();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("collectionEntryListItemSelect", {bubbles: true, cancelable: true, composed: true});
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
        this.setDefaultContextMenu(CtxMenu_Areas_Entry_Lists_List_Item);
        this.addDefaultContextMenuHandler("edit", () => {
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("collectionEntryListItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                index: targetIndex
            };
            this.dispatchEvent(ev);
        });
        this.addDefaultContextMenuHandler("addbefore", () => {
            const dialogEl = new AreaListEntryModal();
            dialogEl.addEventListener("submit", (event) => {
                const {type, ref} = event.data;
                const targetIndex = Array.from(this.parentElement.children).indexOf(this);
                const ev = new Event("collectionEntryListAddElementBefore", {bubbles: true, cancelable: true, composed: true});
                ev.data = {
                    element: this,
                    index: targetIndex,
                    type,
                    ref
                };
                this.dispatchEvent(ev);
            });
            dialogEl.show();
        });
        this.addDefaultContextMenuHandler("addafter", () => {
            const dialogEl = new AreaListEntryModal();
            dialogEl.addEventListener("submit", (event) => {
                const {type, ref} = event.data;
                const targetIndex = Array.from(this.parentElement.children).indexOf(this);
                const ev = new Event("collectionEntryListAddElementAfter", {bubbles: true, cancelable: true, composed: true});
                ev.data = {
                    element: this,
                    index: targetIndex,
                    type,
                    ref
                };
                this.dispatchEvent(ev);
            });
            dialogEl.show();
        });
        this.addDefaultContextMenuHandler("remove", () => {
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("collectionEntryListRemoveElement", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                index: targetIndex
            };
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("jse-world::collections-entry-list-item", TreeNode_Collections_Entry_List_Item);
customElements.define("jse-world-tree-node-collections-entry-listitem", TreeNode_Collections_Entry_List_Item);
