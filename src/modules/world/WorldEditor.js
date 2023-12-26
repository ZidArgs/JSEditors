import ListGroupRegistry from "/emcJS/data/registry/form/ListGroupRegistry.js";
import CustomElement from "/emcJS/ui/element/CustomElement.js";
import TypeValidator from "/emcJS/util/type/TypeValidator.js";
import "/emcJS/ui/container/CaptionPanel.js";
import "/emcJS/ui/container/CollapsePanel.js";
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
import DataManager from "./data/DataManager.js";
import "./ui/tree/StructureEditorTree.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};

class WorldEditor extends CustomElement {

    #activeDetailEditor;

    #formEl_WorldConfig;

    #formEl_LocationsEntry;

    #formEl_CollectionsEntry;

    #formEl_AreasEntry;

    #formEl_ExitsEntry;

    #structureEditorTreeEl;

    #optionGroupRegistry = new ListGroupRegistry("worldEditor_areaContentHints");

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
        this.#structureEditorTreeEl.addEventListener("entitySelect[]", () => {
            this.switchDetailEditor();
        });
        this.#structureEditorTreeEl.refresh();
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
        /* --- */
        DataManager.addEventListener("change", (event) => {
            const {type} = event.data;
            this.#structureEditorTreeEl.refresh(type);
        });
    }

    setWorldData(data) {
        TypeValidator.validate("World", data, {throwErrors: true});
        DataManager.setData(data);
        this.reloadDetailEditor();
        /* --- */
        const options = Object.keys(data.config.areaContentHints);
        this.#optionGroupRegistry.setAll(options);
    }

    getWorldData() {
        return DataManager.getData();
    }

    reset() {
        DataManager.reset();
        scope.reset();
        this.switchDetailEditor();
    }

    switchDetailEditor(detailEditorEl) {
        if (this.#activeDetailEditor != null) {
            this.#activeDetailEditor.resetScroll();
            this.#activeDetailEditor.classList.remove("active");
        }
        if (detailEditorEl != null) {
            detailEditorEl.classList.add("active");
            this.#activeDetailEditor = detailEditorEl;
        }
    }

    reloadDetailEditor() {
        if (this.#activeDetailEditor != null) {
            const data = DataManager.readEntity(scope.entityType, scope.entityName);
            this.#activeDetailEditor.setData(data);
        }
    }

    setFilterConfig(config) {
        scope.filterConfig = config;
        if (this.#activeDetailEditor != null) {
            this.#activeDetailEditor.setFilterConfig(config);
        }
    }

}

customElements.define("jse-world-editor", WorldEditor);
