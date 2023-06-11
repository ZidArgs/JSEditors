import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    areaListEntries, exitListEntries, locationListEntries, collectionListEntries
} from "./data/EntityRegistries.js";
import DefaultWorldConfigDataConverter from "./util/DefaultWorldConfigDataConverter.js";
import "./components/AreaDetailEditor.js";
import "./components/AreaConnectionsEntryDetailEditor.js";
import "./components/AreaListEntryDetailEditor.js";
import "./components/AreaMapConfigDetailEditor.js";
import "./components/ExitDetailEditor.js";
import "./components/LocationDetailEditor.js";
import "./components/tree/StructureEditorTree.js";
import "./components/tree/nodes/AreaTreeNode.js";
import "./components/tree/nodes/AreaListTreeNode.js";
import "./components/tree/nodes/AreaConnectionItemTreeNode.js";
import "./components/tree/nodes/AreaListItemTreeNode.js";
import "./components/tree/nodes/AreaMapConfigTreeNode.js";
import "./components/tree/nodes/ExitTreeNode.js";
import "./components/tree/nodes/LocationTreeNode.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};
import AreaListEntryController from "./controller/AreaListEntryController.js";
import AreaConnectionsEntryController from "./controller/AreaConnectionsEntryController.js";
import LocationEntryController from "./controller/LocationEntryController.js";
import AreaEntryController from "./controller/AreaEntryController.js";
import AreaMapConfigController from "./controller/AreaMapConfigController.js";
import ExitEntryController from "./controller/ExitEntryController.js";
import scope from "./data/WorldEditorScope.js";

const DEFAULT_CONFIG_DATA_CONVERTER = new DefaultWorldConfigDataConverter();

/* TODO add empty detail editor for non-editable tree entries */

class WorldEditor extends CustomElement {

    #configDataConverter;

    /* TODO should be one "path" property (?) */
    #editRef = null;

    #areaListName = null;

    #areaListIndex = null;
    /* --- */

    #detailEditorAreaEl;

    #detailEditorAreaMapConfigEl;

    #detailEditorAreaConnectionsEntryEl;

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
        this.#detailEditorAreaConnectionsEntryEl = this.shadowRoot.getElementById("detail-editor-area-connections-entry");
        this.#detailEditorAreaListEntryEl = this.shadowRoot.getElementById("detail-editor-area-list-entry");
        this.#detailEditorExitEl = this.shadowRoot.getElementById("detail-editor-exit");
        this.#detailEditorLocationEl = this.shadowRoot.getElementById("detail-editor-location");
        this.#detailEditorAreaEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                const areaConfig = scope.config.area[this.#editRef];
                scope.config.area[this.#editRef] = {
                    ...areaConfig,
                    ...event.data
                };
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorAreaMapConfigEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                scope.config.area[this.#editRef].map = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorAreaListEntryEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                scope.config.area[this.#editRef][this.#areaListName][this.#areaListIndex] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorExitEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                scope.config.exit[this.#editRef] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorLocationEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                scope.config.location[this.#editRef] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#reloadTree();
        /* --- */
        new AreaMapConfigController(this, this.#structureEditorTreeEl, this.#detailEditorAreaMapConfigEl);
        new AreaEntryController(this, this.#structureEditorTreeEl, this.#detailEditorAreaEl);
        new AreaConnectionsEntryController(this, this.#structureEditorTreeEl, this.#detailEditorAreaConnectionsEntryEl);
        new AreaListEntryController(this, this.#structureEditorTreeEl, this.#detailEditorAreaListEntryEl);
        new ExitEntryController(this, this.#structureEditorTreeEl, this.#detailEditorExitEl);
        new LocationEntryController(this, this.#structureEditorTreeEl, this.#detailEditorLocationEl);
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
        scope.config = this.configDataConverter.translateSetConfig(config);
        this.#reloadTree();
        this.#extractEntries();
    }

    getConfig() {
        return this.configDataConverter.translateGetConfig(scope.config);
    }

    reset() {
        scope.reset();
        this.#reloadTree();
    }

    switchDetailEditor(detailEditorEl, config, ref, list, index) {
        const currentEditorEl = this.shadowRoot.querySelector("#detail-panel > .active");
        if (currentEditorEl != null) {
            currentEditorEl.classList.remove("active");
        }
        if (detailEditorEl != null) {
            this.#editRef = ref;
            this.#areaListName = list;
            this.#areaListIndex = index;
            detailEditorEl.classList.add("active");
            detailEditorEl.setData(config);
        }
    }

    #reloadTree() {
        const treeConfig = this.configDataConverter.extractTreeStructure(scope.config);
        this.#structureEditorTreeEl.loadConfig(treeConfig);
    }

    #extractEntries() {
        locationListEntries.clear();
        for (const ref in scope.config.location) {
            locationListEntries.add(ref);
        }
        exitListEntries.clear();
        for (const ref in scope.config.exit) {
            exitListEntries.add(ref);
        }
        areaListEntries.clear();
        for (const ref in scope.config.area) {
            areaListEntries.add(ref);
        }
        collectionListEntries.clear();
        for (const ref in scope.config.collection) {
            collectionListEntries.add(ref);
        }
    }

}

customElements.define("jse-world-editor", WorldEditor);
