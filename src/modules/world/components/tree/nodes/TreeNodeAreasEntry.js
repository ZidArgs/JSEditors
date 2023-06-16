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

export default class TreeNodeAreasEntry extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const ev = new Event("areasEntrySelect", {bubbles: true, cancelable: true, composed: true});
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
        const subTreeEl = this.shadowRoot.getElementById("tree");
        subTreeEl.addEventListener("areasEntryConnectionItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index} = event.data;
            const ev = new Event("areasEntryConnectionItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                area: this.ref
            };
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areasEntryListItemSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element, index, list} = event.data;
            const ev = new Event("areasEntryListItemSelect", {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                index,
                list,
                area: this.ref
            };
            this.dispatchEvent(ev);
        });
        subTreeEl.addEventListener("areasEntryMapConfigSelect", (event) => {
            event.stopPropagation();
            event.preventDefault();
            const {element} = event.data;
            const ev = new Event("areasEntryMapConfigSelect", {bubbles: true, cancelable: true, composed: true});
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
            const {element, type, ref, list} = event.data;
            const ev = new Event(event.type, {bubbles: true, cancelable: true, composed: true});
            ev.data = {
                element,
                type,
                ref,
                list,
                area: this.ref
            };
            this.dispatchEvent(ev);
        });
    }

}

TreeNode.registerNodeType("editor-world-area", TreeNodeAreasEntry);
customElements.define("jse-tree-node-world-area", TreeNodeAreasEntry);

