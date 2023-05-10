import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import {
    areaListEntries, exitListEntries, locationListEntries, collectionListEntries
} from "./data/EntityRegistries.js";
import DefaultWorldConfigDataConverter from "./util/DefaultWorldConfigDataConverter.js";
import AreaListEntryModal from "./components/modal/AreaListEntryModal.js";
import "./components/AreaDetailEditor.js";
import "./components/AreaListEntryDetailEditor.js";
import "./components/AreaMapConfigDetailEditor.js";
import "./components/ExitDetailEditor.js";
import "./components/LocationDetailEditor.js";
import "./components/tree/StructureEditorTree.js";
import "./components/tree/nodes/AreaTreeNode.js";
import "./components/tree/nodes/AreaListTreeNode.js";
import "./components/tree/nodes/AreaListItemTreeNode.js";
import "./components/tree/nodes/AreaMapConfigTreeNode.js";
import "./components/tree/nodes/ExitTreeNode.js";
import "./components/tree/nodes/LocationTreeNode.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};

/*
TODO add coordinates input
for area coordinates add input that allows choosing coordinates on any 2d plane
*/

const DEFAULT_CONFIG_DATA_CONVERTER = new DefaultWorldConfigDataConverter();

const DEFAULT_CONFIG = {
    config: {
        defaultArea: "",
        map: {
            color: "black"
        },
        areaContentHints: {},
        region: {
            root: "",
            prefix: "",
            postfix: ""
        },
        gateways: {
            incoming: {
                prefix: "",
                postfix: ""
            },
            outgoing: {
                prefix: "",
                postfix: ""
            },
            variants: []
        }
    },
    area: {},
    location: {},
    exit: {}
};

/* TODO outsource individual categories actions
    like area, location, exit and connection
*/
/* TODO add empty detail editor for non-editable tree entries */

class WorldEditor extends CustomElement {

    #configDataConverter;

    #config = deepClone(DEFAULT_CONFIG);

    /* TODO should be one "path" property */
    #editRef = null;

    #areaListName = null;

    #areaListIndex = null;
    /* --- */

    #detailEditorAreaEl;

    #detailEditorAreaMapConfigEl;

    #detailEditorAreaListEntryEl;

    #detailEditorExitEl;

    #detailEditorLocationEl;

    #structureEditorTreeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#detailEditorAreaEl = this.shadowRoot.getElementById("detail-editor-area");
        this.#detailEditorAreaMapConfigEl = this.shadowRoot.getElementById("detail-editor-area-map-config");
        this.#detailEditorAreaListEntryEl = this.shadowRoot.getElementById("detail-editor-area-list-entry");
        this.#detailEditorExitEl = this.shadowRoot.getElementById("detail-editor-exit");
        this.#detailEditorLocationEl = this.shadowRoot.getElementById("detail-editor-location");
        this.#detailEditorAreaEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                const areaConfig = this.#config.area[this.#editRef];
                this.#config.area[this.#editRef] = {
                    ...areaConfig,
                    ...event.data
                };
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorAreaMapConfigEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                this.#config.area[this.#editRef].map = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorAreaListEntryEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                this.#config.area[this.#editRef][this.#areaListName][this.#areaListIndex] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorExitEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                this.#config.exit[this.#editRef] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorLocationEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                this.#config.location[this.#editRef] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#reloadTree();
        /* --- */
        this.#structureEditorTreeEl.addEventListener("editArea", (event) => {
            const {ref} = event;
            this.#showDetailEditor("area", ref);
        });
        this.#structureEditorTreeEl.addEventListener("editAreaMapConfig", (event) => {
            const {area} = event;
            this.#showDetailEditor("areaMapConfig", area);
        });
        this.#structureEditorTreeEl.addEventListener("editAreaListItem", (event) => {
            const {area, list, index} = event;
            this.#showDetailEditor("areaListEntry", area, list, index);
        });
        this.#structureEditorTreeEl.addEventListener("menuAreaListItem", (/* event */) => {
            // const {area, list, index} = event;
            const dialogEl = new AreaListEntryModal();
            dialogEl.show();
        });
        this.#structureEditorTreeEl.addEventListener("editExit", (event) => {
            const {ref} = event;
            this.#showDetailEditor("exit", ref);
        });
        this.#structureEditorTreeEl.addEventListener("editLocation", (event) => {
            const {ref} = event;
            this.#showDetailEditor("location", ref);
        });
    }

    set configDataConverter(value) {
        if (value instanceof DefaultWorldConfigDataConverter) {
            this.#configDataConverter = value;
        } else {
            this.#configDataConverter = null;
        }
    }

    get configDataConverter() {
        return this.#configDataConverter ?? DEFAULT_CONFIG_DATA_CONVERTER;
    }

    setConfig(config) {
        this.#config = this.configDataConverter.translateSetConfig(config);
        this.#reloadTree();
        this.#extractEntries();
    }

    getConfig() {
        return this.configDataConverter.translateGetConfig(this.#config);
    }

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#reloadTree();
    }

    #showDetailEditor(type, ref, list, index) {
        this.#detailEditorAreaEl.classList.remove("active");
        this.#detailEditorAreaMapConfigEl.classList.remove("active");
        this.#detailEditorAreaListEntryEl.classList.remove("active");
        this.#detailEditorExitEl.classList.remove("active");
        this.#detailEditorLocationEl.classList.remove("active");
        /* --- */
        this.#editRef = ref;
        this.#areaListName = list;
        this.#areaListIndex = index;
        const detailEditorEl = this.#getEditor(type);
        detailEditorEl.classList.add("active");
        const config = this.#getCurrentElementConfig(type);
        detailEditorEl.setData(config);
    }

    #reloadTree() {
        const treeConfig = this.configDataConverter.extractTreeStructure(this.#config);
        this.#structureEditorTreeEl.loadConfig(treeConfig);
    }

    #getCurrentElementConfig(type) {
        if (type === "area") {
            return this.#config.area[this.#editRef];
        }
        if (type === "areaMapConfig") {
            return this.#config.area[this.#editRef].map;
        }
        if (type === "areaListEntry") {
            return this.#config.area[this.#editRef][this.#areaListName][this.#areaListIndex];
        }
        if (type === "exit") {
            return this.#config.exit[this.#editRef];
        }
        if (type === "location") {
            return this.#config.location[this.#editRef];
        }
    }

    #getEditor(type) {
        if (type === "area") {
            return this.#detailEditorAreaEl;
        }
        if (type === "areaMapConfig") {
            return this.#detailEditorAreaMapConfigEl;
        }
        if (type === "areaListEntry") {
            return this.#detailEditorAreaListEntryEl;
        }
        if (type === "exit") {
            return this.#detailEditorExitEl;
        }
        if (type === "location") {
            return this.#detailEditorLocationEl;
        }
    }

    #extractEntries() {
        locationListEntries.clear();
        for (const ref in this.#config.location) {
            locationListEntries.add(ref);
        }
        exitListEntries.clear();
        for (const ref in this.#config.exit) {
            exitListEntries.add(ref);
        }
        areaListEntries.clear();
        for (const ref in this.#config.area) {
            areaListEntries.add(ref);
        }
        collectionListEntries.clear();
        for (const ref in this.#config.collection) {
            collectionListEntries.add(ref);
        }
    }

}

customElements.define("jse-world-editor", WorldEditor);
