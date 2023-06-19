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
import "./components/tree/nodes/TreeNodeAreasEntry.js";
import "./components/tree/nodes/TreeNodeAreasEntryConnectionsItem.js";
import "./components/tree/nodes/TreeNodeAreasEntryList.js";
import "./components/tree/nodes/TreeNodeAreasEntryListItem.js";
import "./components/tree/nodes/TreeNodeAreasEntryMapConfig.js";
import "./components/tree/nodes/TreeNodeExitsEntry.js";
import "./components/tree/nodes/TreeNodeLocationsEntry.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};
import ControllerAreasEntry from "./controller/ControllerAreasEntry.js";
import ControllerAreasEntryConnectionsItem from "./controller/ControllerAreasEntryConnectionsItem.js";
import ControllerAreasEntryList from "./controller/ControllerAreasEntryList.js";
import ControllerAreasEntryListItem from "./controller/ControllerAreasEntryListItem.js";
import ControllerAreasEntryMapConfig from "./controller/ControllerAreasEntryMapConfig.js";
import ControllerExitsEntry from "./controller/ControllerExitsEntry.js";
import ControllerLocationsEntry from "./controller/ControllerLocationsEntry.js";
import scope from "./data/WorldEditorScope.js";

const DEFAULT_CONFIG_DATA_CONVERTER = new DefaultWorldConfigDataConverter();

/* TODO add empty detail editor for non-editable tree entries */

class WorldEditor extends CustomElement {

    #configDataConverter;

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
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.reloadTree();
        /* --- */
        new ControllerAreasEntry(this, this.#structureEditorTreeEl, this.#detailEditorAreaEl);
        new ControllerAreasEntryConnectionsItem(this, this.#structureEditorTreeEl, this.#detailEditorAreaConnectionsEntryEl);
        new ControllerAreasEntryList(this, this.#structureEditorTreeEl);
        new ControllerAreasEntryListItem(this, this.#structureEditorTreeEl, this.#detailEditorAreaListEntryEl);
        new ControllerAreasEntryMapConfig(this, this.#structureEditorTreeEl, this.#detailEditorAreaMapConfigEl);
        new ControllerExitsEntry(this, this.#structureEditorTreeEl, this.#detailEditorExitEl);
        new ControllerLocationsEntry(this, this.#structureEditorTreeEl, this.#detailEditorLocationEl);
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
        this.reloadTree();
        this.#extractEntries();
    }

    getConfig() {
        return this.configDataConverter.translateGetConfig(scope.config);
    }

    reset() {
        scope.reset();
        this.reloadTree();
        this.switchDetailEditor();
    }

    switchDetailEditor(detailEditorEl) {
        const currentEditorEl = this.shadowRoot.querySelector("#detail-panel > .active");
        if (currentEditorEl != null) {
            currentEditorEl.classList.remove("active");
        }
        if (detailEditorEl != null) {
            detailEditorEl.classList.add("active");
        }
    }

    reloadTree() {
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
