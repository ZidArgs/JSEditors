import CustomElement from "/emcJS/ui/element/CustomElement.js";
import ContextMenuManagerMixin from "/emcJS/ui/mixin/ContextMenuManagerMixin.js";
import {
    mix
} from "/emcJS/util/Mixin.js";
import "/emcJS/ui/tree/Tree.js";
// import StructureTreeContextMenuForm from "./contextmenu/StructureTreeContextMenuForm.js";
// import StructureTreeContextMenuFormElement from "./contextmenu/StructureTreeContextMenuFormElement.js";
// import StructureTreeContextMenuFormElementWithChild from "./contextmenu/StructureTreeContextMenuFormElementWithChild.js";
import TPL from "./StructureEditorTree.js.html" assert {type: "html"};
import STYLE from "./StructureEditorTree.js.css" assert {type: "css"};

const BaseClass = mix(
    CustomElement
).with(
    ContextMenuManagerMixin
);

export default class StructureEditorTree extends BaseClass {

    #treeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.addEventListener("contextmenusclosed", () => {
            this.#treeEl.markItemByPathForMenu();
        });
        // TODO add contextmenus
        /* --- */
        this.#treeEl = this.shadowRoot.getElementById("tree");
        this.#treeEl.addEventListener("locationSelect", (event) => {
            const {ref} = event;
            const ev = new Event("editLocation", {bubbles: true, cancelable: true});
            ev.ref = ref;
            this.dispatchEvent(ev);
        });
        this.#treeEl.addEventListener("exitSelect", (event) => {
            const {ref} = event;
            const ev = new Event("editExit", {bubbles: true, cancelable: true});
            ev.ref = ref;
            this.dispatchEvent(ev);
        });
        this.#treeEl.addEventListener("areaSelect", (event) => {
            const {ref} = event;
            const ev = new Event("editArea", {bubbles: true, cancelable: true});
            ev.ref = ref;
            this.dispatchEvent(ev);
        });
        this.#treeEl.addEventListener("areaListItemSelect", (event) => {
            const {area, ref} = event;
            const ev = new Event("editAreaListItem", {bubbles: true, cancelable: true});
            ev.area = area;
            ev.ref = ref;
            this.dispatchEvent(ev);
        });
        this.#treeEl.addEventListener("select", (event) => {
            if (!event.isSelected) {
                event.preventDefault();
            }
        });
        this.#treeEl.addEventListener("menu", (event) => {
            const {path, element} = event;
            this.#treeEl.markItemByPathForMenu(path);
            if (path.length === 1) {
                this.showContextMenu("form", event, {path});
            } else if (path.length > 1) {
                if (element.forceCollapsible) {
                    this.showContextMenu("elementWithChild", event, {path});
                } else {
                    this.showContextMenu("element", event, {path});
                }
            }
            event.stopPropagation();
            event.preventDefault();
        });
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
        const {location, exit, area} = config;
        const tree = {
            world: {
                nodeType: "editor-world-main-config",
                label: "World Config"
            },
            location: {
                nodeType: "editor-world-category-location",
                label: "Locations",
                sorted: true,
                startCollapsed: true,
                children: this.#extractLocations(location)
            },
            exit: {
                nodeType: "editor-world-category-exit",
                label: "Exits",
                sorted: true,
                startCollapsed: true,
                children: this.#extractExits(exit)
            },
            area: {
                nodeType: "editor-world-category-area",
                label: "Areas",
                sorted: true,
                startCollapsed: true,
                children: this.#extractAreas(area)
            }
        };
        this.#treeEl.loadConfig(tree);
    }

    #extractLocations(locations = {}) {
        const res = {};
        for (const ref in locations) {
            const data = locations[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "editor-world-location",
                label: ref,
                type
            };
        }
        return res;
    }

    #extractExits(exits = {}) {
        const res = {};
        for (const ref in exits) {
            const data = exits[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "editor-world-exit",
                label: ref,
                type
            };
        }
        return res;
    }

    #extractAreas(areas = {}) {
        const res = {};
        for (const ref in areas) {
            const data = areas[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "editor-world-exit",
                label: ref,
                type,
                children: {
                    list: {
                        nodeType: "editor-world-area-list",
                        label: "List (Vanilla)",
                        startCollapsed: true,
                        children: this.#extractAreaList(data.list)
                    }
                }
            };
            /*
            TODO lists should be stored in an object with keyed lists
            */
            if (data.list_mq != null) { // FIXME bad data design
                res[ref].children["list_mq"] = {
                    nodeType: "editor-world-area-list_mq",
                    label: "List (Master Quest)",
                    startCollapsed: true,
                    children: this.#extractAreaList(data.list_mq)
                }
            }
        }
        return res;
    }

    #extractAreaList(areaListItems = []) {
        const res = {};
        for (const item of areaListItems) {
            const type = item.type ?? item.category;
            if (type === "collection") {
                const list = item.list;
                res[item.id] = {
                    nodeType: "editor-world-area-listcategory",
                    label: item.id,
                    children: this.#extractAreaList(list)
                };
            } else {
                res[item.id] = {
                    nodeType: "editor-world-area-listitem",
                    label: item.id,
                    type
                };
            }
        }
        return res;
    }

}

customElements.define("jse-world-editor-structure-tree", StructureEditorTree);
