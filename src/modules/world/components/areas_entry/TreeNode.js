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

export default class TreeNode_Areas_Entry extends BaseClass {

    constructor() {
        super();
        /* --- */
        this.addEventListener("contentclick", (event) => this.#select(event));
        this.addEventListener("contentcontextmenu", (event) => this.#contextMenu(event));
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
        /** TODO
         * - make single event with operation descriptor
         * - event reciever should hold map with a call for each operation descriptor
         * - operation descriptor called functions should be outsourced to seperate files
         */
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

    #select(event) {
        event.stopPropagation();
        const targetIndex = Array.from(this.parentElement.children).indexOf(this);
        const ev = new Event("select_Areas_Entry", {bubbles: true, cancelable: true, composed: true});
        ev.data = {
            element: this,
            index: targetIndex,
            ref: this.ref
        };
        this.dispatchEvent(ev);
    }

    #contextMenu(event) {
        event.stopPropagation();
        this.showDefaultContextMenu(event);
        return false;
    }

}

TreeNode.registerNodeType("jse-world::areas-entry", TreeNode_Areas_Entry);
customElements.define("jse-world-tree-node-areas-entry", TreeNode_Areas_Entry);
