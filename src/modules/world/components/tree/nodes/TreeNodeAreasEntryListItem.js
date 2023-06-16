import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin";
import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import {
    mix
} from "/emcJS/util/Mixin.js";
import TreeCtxMenuAreasEntryListItem from "../../contextmenu/TreeCtxMenuAreasEntryListItem.js";
import AreaListEntryModal from "../../modal/AreaListEntryModal.js";

const BaseClass = mix(
    TreeNode
).with(
    ContextMenuManagerMixin
);

export default class TreeNodeAreasEntryListItem extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("areasEntryListItemSelect", {bubbles: true, cancelable: true, composed: true});
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
        this.setDefaultContextMenu(TreeCtxMenuAreasEntryListItem);
        this.addDefaultContextMenuHandler("edit", () => {
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("areaListItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element: this,
                index: targetIndex
            };
            this.dispatchEvent(ev);
        });
        this.addDefaultContextMenuHandler("addbefore", () => {
            const dialogEl = new AreaListEntryModal();
            dialogEl.onsubmit = function(event) {
                const {type, ref} = event.data;
                const ev = new Event("areaListAddElementBefore", {bubbles: true, cancelable: true, composed: true});
                ev.data = {
                    element: this,
                    type,
                    ref
                };
                this.dispatchEvent(ev);
            }
            dialogEl.show();
        });
        this.addDefaultContextMenuHandler("addafter", () => {
            const dialogEl = new AreaListEntryModal();
            dialogEl.onsubmit = function(event) {
                const {type, ref} = event.data;
                const ev = new Event("areaListAddElementAfter", {bubbles: true, cancelable: true, composed: true});
                ev.data = {
                    element: this,
                    type,
                    ref
                };
                this.dispatchEvent(ev);
            }
            dialogEl.show();
        });
        this.addDefaultContextMenuHandler("remove", () => {
            const dialogEl = new AreaListEntryModal();
            dialogEl.onsubmit = function(event) {
                const {type, ref} = event.data;
                const ev = new Event("areaListRemoveElement", {bubbles: true, cancelable: true, composed: true});
                ev.data = {
                    element: this,
                    type,
                    ref
                };
                this.dispatchEvent(ev);
            }
            dialogEl.show();
        });
    }

}

TreeNode.registerNodeType("editor-world-area-list-item", TreeNodeAreasEntryListItem);
customElements.define("jse-tree-node-world-area-listitem", TreeNodeAreasEntryListItem);

