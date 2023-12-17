import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    getFromTreeConfigByRefPath
} from "/emcJS/util/helper/TreeConfig.js";
import {
    areaListEntries, exitListEntries, locationListEntries, collectionListEntries
} from "./data/EntityRegistries.js";
import DefaultWorldConfigDataConverter from "./util/DefaultWorldConfigDataConverter.js";
import Controller_Areas from "./components/areas/Controller.js";
import Controller_Areas_Entry from "./components/areas_entry/Controller.js";
import Controller_Areas_Entry_Connections_Item from "./components/areas_entry_connections_item/Controller.js";
import Controller_Areas_Entry_Lists_List from "./components/areas_entry_lists_list/Controller.js";
import Controller_Areas_Entry_Lists_List_Item from "./components/areas_entry_lists_list_item/Controller.js";
import Controller_Areas_Entry_MapConfig from "./components/areas_entry_mapconfig/Controller.js";
import Controller_Collections from "./components/collections/Controller.js";
import Controller_Collections_Entry from "./components/collections_entry/Controller.js";
import ControllerCollectionEntryList from "./components/collections_entry_list/Controller.js";
import Controller_Collections_Entry_List_Item from "./components/collections_entry_list_item/Controller.js";
import Controller_Exits from "./components/exits/Controller.js";
import Controller_Exits_Entry from "./components/exits_entry/Controller.js";
import Controller_Locations from "./components/locations/Controller.js";
import Controller_Locations_Entry from "./components/locations_entry/Controller.js";
import Controller_WorldConfig from "./components/worldconfig/Controller.js";
import scope from "./data/WorldEditorScope.js";
import "./ui/tree/StructureEditorTree.js";
import "./components/locations_entry/EditorForm.js";
import "./components/areas_entry/EditorForm.js";
import "./components/areas_entry_connections_item/EditorForm.js";
import "./components/areas_entry_lists_list_item/EditorForm.js";
import "./components/areas_entry_mapconfig/EditorForm.js";
import "./components/exits_entry/EditorForm.js";
import "./components/areas/TreeNode.js";
import "./components/areas_entry/TreeNode.js";
import "./components/areas_entry_connections/TreeNode.js";
import "./components/areas_entry_connections_item/TreeNode.js";
import "./components/areas_entry_lists_list/TreeNode.js";
import "./components/areas_entry_lists_list_item/TreeNode.js";
import "./components/areas_entry_mapconfig/TreeNode.js";
import "./components/collections/TreeNode.js";
import "./components/collections_entry/TreeNode.js";
import "./components/collections_entry_list/TreeNode.js";
import "./components/collections_entry_list_item/TreeNode.js";
import "./components/exits/TreeNode.js";
import "./components/exits_entry/TreeNode.js";
import "./components/locations/TreeNode.js";
import "./components/locations_entry/TreeNode.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};

const DEFAULT_CONFIG_DATA_CONVERTER = new DefaultWorldConfigDataConverter();

/* TODO add empty detail editor for non-editable tree entries */

class WorldEditor extends CustomElement {

    #configDataConverter;

    #editorFormEl_WorldConfig;

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
        this.#editorFormEl_WorldConfig = this.shadowRoot.getElementById("editor-form-world-config");
        /* --- */
        this.#detailEditorAreaEl = this.shadowRoot.getElementById("detail-editor-area");
        this.#detailEditorAreaMapConfigEl = this.shadowRoot.getElementById("detail-editor-area-map-config");
        this.#detailEditorAreaConnectionsEntryEl = this.shadowRoot.getElementById("detail-editor-area-connections-entry");
        this.#detailEditorAreaListEntryEl = this.shadowRoot.getElementById("detail-editor-area-list-entry");
        this.#detailEditorExitEl = this.shadowRoot.getElementById("detail-editor-exit");
        this.#detailEditorLocationEl = this.shadowRoot.getElementById("detail-editor-location");
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#reloadTree();
        /* --- */
        new Controller_Areas(this, this.#structureEditorTreeEl);
        new Controller_Areas_Entry(this, this.#structureEditorTreeEl, this.#detailEditorAreaEl);
        new Controller_Areas_Entry_Connections_Item(this, this.#structureEditorTreeEl, this.#detailEditorAreaConnectionsEntryEl);
        new Controller_Areas_Entry_Lists_List(this, this.#structureEditorTreeEl);
        new Controller_Areas_Entry_Lists_List_Item(this, this.#structureEditorTreeEl, this.#detailEditorAreaListEntryEl);
        new Controller_Areas_Entry_MapConfig(this, this.#structureEditorTreeEl, this.#detailEditorAreaMapConfigEl);
        new Controller_Collections(this, this.#structureEditorTreeEl);
        new Controller_Collections_Entry(this, this.#structureEditorTreeEl/* , this.#detailEditorCollectionEl */);
        new ControllerCollectionEntryList(this, this.#structureEditorTreeEl);
        new Controller_Collections_Entry_List_Item(this, this.#structureEditorTreeEl/* , this.#detailEditorCollectionListEntryEl */);
        new Controller_Exits(this, this.#structureEditorTreeEl);
        new Controller_Exits_Entry(this, this.#structureEditorTreeEl, this.#detailEditorExitEl);
        new Controller_Locations(this, this.#structureEditorTreeEl);
        new Controller_Locations_Entry(this, this.#structureEditorTreeEl, this.#detailEditorLocationEl);
        new Controller_WorldConfig(this, this.#structureEditorTreeEl, this.#editorFormEl_WorldConfig);
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

    #reloadTree() {
        const treeConfig = this.configDataConverter.extractTreeStructure(scope.config);
        this.#structureEditorTreeEl.loadConfig(treeConfig);
    }

    reloadTreeAtPath(path) {
        const treeConfig = this.configDataConverter.extractTreeStructure(scope.config);
        const subTreeConfig = getFromTreeConfigByRefPath(treeConfig, path ?? []);
        this.#structureEditorTreeEl.loadConfigAtRefPath(path ?? [], subTreeConfig);
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
