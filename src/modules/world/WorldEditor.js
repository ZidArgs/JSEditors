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
import Controller_Collections from "./components/collections/Controller.js";
import Controller_Collections_Entry from "./components/collections_entry/Controller.js";
import Controller_Exits from "./components/exits/Controller.js";
import Controller_Exits_Entry from "./components/exits_entry/Controller.js";
import Controller_Locations from "./components/locations/Controller.js";
import Controller_Locations_Entry from "./components/locations_entry/Controller.js";
import Controller_WorldConfig from "./components/worldconfig/Controller.js";
import scope from "./data/WorldEditorScope.js";
import "./ui/tree/StructureEditorTree.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};

const DEFAULT_CONFIG_DATA_CONVERTER = new DefaultWorldConfigDataConverter();

/* TODO add empty detail editor for non-editable tree entries */

class WorldEditor extends CustomElement {

    #configDataConverter;

    #formEl_WorldConfig;

    #formEl_LocationsEntry;

    #formEl_CollectionsEntry;

    #formEl_AreasEntry;

    #formEl_ExitsEntry;

    #structureEditorTreeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#formEl_WorldConfig = this.shadowRoot.getElementById("form-world-config");
        this.#formEl_LocationsEntry = this.shadowRoot.getElementById("form-locations-entry");
        this.#formEl_CollectionsEntry = this.shadowRoot.getElementById("form-collections-entry");
        this.#formEl_AreasEntry = this.shadowRoot.getElementById("form-areas-entry");
        this.#formEl_ExitsEntry = this.shadowRoot.getElementById("form-exits-entry");
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#reloadTree();
        /* --- */
        new Controller_WorldConfig(this, this.#structureEditorTreeEl, this.#formEl_WorldConfig);
        new Controller_Locations(this, this.#structureEditorTreeEl);
        new Controller_Locations_Entry(this, this.#structureEditorTreeEl, this.#formEl_LocationsEntry);
        new Controller_Collections(this, this.#structureEditorTreeEl);
        new Controller_Collections_Entry(this, this.#structureEditorTreeEl, this.#formEl_CollectionsEntry);
        new Controller_Areas(this, this.#structureEditorTreeEl);
        new Controller_Areas_Entry(this, this.#structureEditorTreeEl, this.#formEl_AreasEntry);
        new Controller_Exits(this, this.#structureEditorTreeEl);
        new Controller_Exits_Entry(this, this.#structureEditorTreeEl, this.#formEl_ExitsEntry);
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
