import CustomElement from "@emcjs/fe/ui/element/CustomElement.js";
import ContextMenuManagerMixin from "@emcjs/fe/ui/mixin/ContextMenuManagerMixin.js";
import {
    mix
} from "@emcjs/core/util/Mixin.js";
import "@emcjs/fe/ui/tree/Tree.js";
import StructureTreeContextMenuForm from "../contextmenu/StructureTreeContextMenuForm.js";
import StructureTreeContextMenuFormElement from "../contextmenu/StructureTreeContextMenuFormElement.js";
import StructureTreeContextMenuFormElementWithChild from "../contextmenu/StructureTreeContextMenuFormElementWithChild.js";
import TPL from "./StructureEditorTree.js.html" assert {type: "html"};
import STYLE from "./StructureEditorTree.js.css" assert {type: "css"};

const BaseClass = mix(
    CustomElement
).with(
    ContextMenuManagerMixin
);

export default class StructureEditorTree extends BaseClass {

    #treeEl;

    #newButtonEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.addEventListener("contextmenusclosed", () => {
            this.#treeEl.markItemForMenuByPath();
        });
        this.setContextMenu("form", StructureTreeContextMenuForm);
        this.addContextMenuHandler("form", "edit", (event) => {
            const {path} = event.props[0];
            this.selectItemByPath(path);
        });
        this.addContextMenuHandler("form", "addbefore", (event) => {
            const {path, refPath} = event.props[0];
            const ev = new Event("addForm", {bubbles: true, cancelable: true});
            ev.path = path;
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        this.addContextMenuHandler("form", "addafter", (event) => {
            const {path, refPath} = event.props[0];
            const ev = new Event("addForm", {bubbles: true, cancelable: true});
            ev.path = [path[0] + 1];
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        this.addContextMenuHandler("form", "addelementtop", (event) => {
            const {path, refPath} = event.props[0];
            this.#addElement(path, refPath, true);
        });
        this.addContextMenuHandler("form", "addelementbottom", (event) => {
            const {path, refPath} = event.props[0];
            this.#addElement(path, refPath, false);
        });
        this.addContextMenuHandler("form", "remove", (event) => {
            const {path, refPath} = event.props[0];
            const ev = new Event("removeForm", {bubbles: true, cancelable: true});
            ev.path = path;
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        /* --- */
        this.setContextMenu("element", StructureTreeContextMenuFormElement);
        this.addContextMenuHandler("element", "edit", (event) => {
            const {path} = event.props[0];
            this.selectItemByPath(path);
        });
        this.addContextMenuHandler("element", "addbefore", (event) => {
            const {path, refPath} = event.props[0];
            const ev = new Event("addElement", {bubbles: true, cancelable: true});
            ev.path = [...path];
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        this.addContextMenuHandler("element", "addafter", (event) => {
            const {path, refPath} = event.props[0];
            const newPath = [...path];
            const index = newPath.pop();
            const ev = new Event("addElement", {bubbles: true, cancelable: true});
            ev.path = [...newPath, index + 1];
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        this.addContextMenuHandler("element", "remove", (event) => {
            const {path, refPath} = event.props[0];
            const ev = new Event("removeElement", {bubbles: true, cancelable: true});
            ev.path = path;
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        /* --- */
        this.setContextMenu("elementWithChild", StructureTreeContextMenuFormElementWithChild);
        this.addContextMenuHandler("elementWithChild", "edit", (event) => {
            const {path} = event.props[0];
            this.selectItemByPath(path);
        });
        this.addContextMenuHandler("elementWithChild", "addbefore", (event) => {
            const {path, refPath} = event.props[0];
            const ev = new Event("addElement", {bubbles: true, cancelable: true});
            ev.path = [...path];
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        this.addContextMenuHandler("elementWithChild", "addafter", (event) => {
            const {path, refPath} = event.props[0];
            const newPath = [...path];
            const index = newPath.pop();
            const ev = new Event("addElement", {bubbles: true, cancelable: true});
            ev.path = [...newPath, index + 1];
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        this.addContextMenuHandler("elementWithChild", "addelementtop", (event) => {
            const {path, refPath} = event.props[0];
            this.#addElement(path, refPath, true);
        });
        this.addContextMenuHandler("elementWithChild", "addelementbottom", (event) => {
            const {path, refPath} = event.props[0];
            this.#addElement(path, refPath, false);
        });
        this.addContextMenuHandler("elementWithChild", "remove", (event) => {
            const {path, refPath} = event.props[0];
            const ev = new Event("removeElement", {bubbles: true, cancelable: true});
            ev.path = path;
            ev.refPath = refPath;
            this.dispatchEvent(ev);
        });
        /* --- */
        this.#treeEl = this.shadowRoot.getElementById("tree");
        this.#treeEl.addEventListener("select", (event) => {
            if (!event.data.isSelected) {
                event.preventDefault();
                const {path, refPath} = event.data;
                if (path.length === 1) {
                    const ev = new Event("editForm", {bubbles: true, cancelable: true});
                    ev.path = path;
                    ev.refPath = refPath;
                    this.dispatchEvent(ev);
                } else if (path.length > 1) {
                    const ev = new Event("editElement", {bubbles: true, cancelable: true});
                    ev.path = path;
                    ev.refPath = refPath;
                    this.dispatchEvent(ev);
                }
            }
        });
        this.#treeEl.addEventListener("menu", (event) => {
            const {path, refPath, element} = event.data;
            this.#treeEl.markItemForMenuByPath(path);
            if (path.length === 1) {
                this.showContextMenu("form", event, {path, refPath});
            } else if (path.length > 1) {
                if (element.forceCollapsible) {
                    this.showContextMenu("elementWithChild", event, {path, refPath});
                } else {
                    this.showContextMenu("element", event, {path, refPath});
                }
            }
            event.stopPropagation();
            event.preventDefault();
        });
        /* --- */
        this.#newButtonEl = this.shadowRoot.getElementById("addform");
        this.#newButtonEl.addEventListener("click", () => {
            const event = new Event("addForm", {bubbles: true, cancelable: true});
            this.dispatchEvent(event);
        });
    }

    #addElement(path, refPath, top = false) {
        const ev = new Event("addElement", {bubbles: true, cancelable: true});
        ev.path = [...path, top ? 0 : -1];
        ev.refPath = refPath;
        this.dispatchEvent(ev);
    }

    selectItemByPath(path) {
        this.#treeEl.forcePathExpanded(path.slice(0, -1));
        this.#treeEl.selectItemByPath(path);
    }

    selectItemByKey(key) {
        const treeNodeEl = this.#treeEl.querySelector(`[ref="${key}"]`);
        treeNodeEl.click();
    }

    forcePathExpanded(path) {
        this.#treeEl.forcePathExpanded(path);
    }

    loadConfig(config) {
        if (Object.keys(config).length) {
            this.#newButtonEl.style.display = "none";
        } else {
            this.#newButtonEl.style.display = "";
        }
        this.#treeEl.loadConfig(config);
    }

    loadConfigAtRefPath(path, config) {
        if (!Array.isArray(path)) {
            throw new Error("path must be an array");
        }
        if (path.length == 0) {
            this.loadConfig(config);
        } else {
            this.#treeEl.loadConfigAtRefPath(path, config);
        }
    }

}

customElements.define("jse-form-editor-structure-tree", StructureEditorTree);
