import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    areaListEntries, exitListEntries, locationListEntries, collectionListEntries
} from "./data/EntityRegistries.js";
import DefaultWorldConfigDataConverter from "./util/DefaultWorldConfigDataConverter.js";
import ControllerArea from "./controller/ControllerArea.js";
import ControllerAreaEntry from "./controller/ControllerAreaEntry.js";
import ControllerAreaEntryConnectionsItem from "./controller/ControllerAreaEntryConnectionsItem.js";
import ControllerAreaEntryList from "./controller/ControllerAreaEntryList.js";
import ControllerAreaEntryListItem from "./controller/ControllerAreaEntryListItem.js";
import ControllerAreaEntryMapConfig from "./controller/ControllerAreaEntryMapConfig.js";
import ControllerCollection from "./controller/ControllerCollection.js";
import ControllerCollectionEntry from "./controller/ControllerCollectionEntry.js";
import ControllerCollectionEntryList from "./controller/ControllerCollectionEntryList.js";
import ControllerCollectionEntryListItem from "./controller/ControllerCollectionEntryListItem.js";
import ControllerExit from "./controller/ControllerExit.js";
import ControllerExitEntry from "./controller/ControllerExitEntry.js";
import ControllerLocation from "./controller/ControllerLocation.js";
import ControllerLocationEntry from "./controller/ControllerLocationEntry.js";
import scope from "./data/WorldEditorScope.js";
import "./components/AreaDetailEditor.js";
import "./components/AreaConnectionsEntryDetailEditor.js";
import "./components/AreaListEntryDetailEditor.js";
import "./components/AreaMapConfigDetailEditor.js";
import "./components/ExitDetailEditor.js";
import "./components/LocationDetailEditor.js";
import "./components/tree/StructureEditorTree.js";
import "./components/tree/nodes/TreeNodeArea.js";
import "./components/tree/nodes/TreeNodeAreaEntry.js";
import "./components/tree/nodes/TreeNodeAreaEntryConnections.js";
import "./components/tree/nodes/TreeNodeAreaEntryConnectionsItem.js";
import "./components/tree/nodes/TreeNodeAreaEntryList.js";
import "./components/tree/nodes/TreeNodeAreaEntryListItem.js";
import "./components/tree/nodes/TreeNodeAreaEntryMapConfig.js";
import "./components/tree/nodes/TreeNodeCollection.js";
import "./components/tree/nodes/TreeNodeCollectionEntry.js";
import "./components/tree/nodes/TreeNodeCollectionEntryList.js";
import "./components/tree/nodes/TreeNodeCollectionEntryListItem.js";
import "./components/tree/nodes/TreeNodeExit.js";
import "./components/tree/nodes/TreeNodeExitEntry.js";
import "./components/tree/nodes/TreeNodeLocation.js";
import "./components/tree/nodes/TreeNodeLocationEntry.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};

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
        new ControllerArea(this, this.#structureEditorTreeEl);
        new ControllerAreaEntry(this, this.#structureEditorTreeEl, this.#detailEditorAreaEl);
        new ControllerAreaEntryConnectionsItem(this, this.#structureEditorTreeEl, this.#detailEditorAreaConnectionsEntryEl);
        new ControllerAreaEntryList(this, this.#structureEditorTreeEl);
        new ControllerAreaEntryListItem(this, this.#structureEditorTreeEl, this.#detailEditorAreaListEntryEl);
        new ControllerAreaEntryMapConfig(this, this.#structureEditorTreeEl, this.#detailEditorAreaMapConfigEl);
        new ControllerCollection(this, this.#structureEditorTreeEl);
        new ControllerCollectionEntry(this, this.#structureEditorTreeEl/* , this.#detailEditorAreaEl */);
        new ControllerCollectionEntryList(this, this.#structureEditorTreeEl);
        new ControllerCollectionEntryListItem(this, this.#structureEditorTreeEl/* , this.#detailEditorAreaListEntryEl */);
        new ControllerExit(this, this.#structureEditorTreeEl);
        new ControllerExitEntry(this, this.#structureEditorTreeEl, this.#detailEditorExitEl);
        new ControllerLocation(this, this.#structureEditorTreeEl);
        new ControllerLocationEntry(this, this.#structureEditorTreeEl, this.#detailEditorLocationEl);
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

    setFilterConfig(config) {
        scope.filterConfig = config;
    }

}

customElements.define("jse-world-editor", WorldEditor);
