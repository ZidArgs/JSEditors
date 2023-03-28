import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import DefaultWorldConfigDataConverter from "./util/DefaultWorldConfigDataConverter.js";
import "./components/AreaDetailEditor.js";
import "./components/AreaListEntryDetailEditor.js";
import "./components/AreaMapConfigDetailEditor.js";
import "./components/ExitDetailEditor.js";
import "./components/LocationDetailEditor.js";
import "./components/tree/StructureEditorTree.js";
import "./components/tree/nodes/AreaListItemTreeNode.js";
import "./components/tree/nodes/AreaMapConfigTreeNode.js";
import "./components/tree/nodes/AreaTreeNode.js";
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
        prefetchEntries: false, // TODO really needed?
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

class WorldEditor extends CustomElement {

    #configDataConverter;

    #config = deepClone(DEFAULT_CONFIG);

    #editType = "";

    #editRef = "";

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
                // this.#config.area[this.#editRef].map = event.data;
                // this.dispatchEvent(new Event("change"));
            }
        });
        this.#detailEditorAreaListEntryEl.addEventListener("save", (event) => {
            if (this.#editRef !== "") {
                // const [area, ...path] = this.#editRef.split(".");
                // this.#config.area[area] = event.data;
                // this.dispatchEvent(new Event("change"));
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
            this.#showDetailEditor("area", event.ref);
        });
        // this.#structureEditorTreeEl.addEventListener("areaMapConfigSelect", (event) => {
        //     this.#showDetailEditor("areaMapConfig", event.ref);
        // });
        this.#structureEditorTreeEl.addEventListener("editAreaListItem", (event) => {
            this.#showDetailEditor("areaListEntry", event.ref);
        });
        this.#structureEditorTreeEl.addEventListener("editExit", (event) => {
            this.#showDetailEditor("exit", event.ref);
        });
        this.#structureEditorTreeEl.addEventListener("editLocation", (event) => {
            this.#showDetailEditor("location", event.ref);
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
    }

    getConfig() {
        return this.configDataConverter.translateGetConfig(this.#config);
    }

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#reloadTree();
    }

    #showDetailEditor(type, ref) {
        this.#detailEditorAreaEl.classList.remove("active");
        this.#detailEditorAreaMapConfigEl.classList.remove("active");
        this.#detailEditorAreaListEntryEl.classList.remove("active");
        this.#detailEditorExitEl.classList.remove("active");
        this.#detailEditorLocationEl.classList.remove("active");
        /* --- */
        this.#editType = type;
        this.#editRef = ref;
        const detailEditorEl = this.#getEditor(type);
        detailEditorEl.classList.add("active");
        const config = this.#getCurrentElementConfig();
        detailEditorEl.setData(config);
    }

    #reloadTree() {
        const treeConfig = this.configDataConverter.extractTreeStructure(this.#config);
        this.#structureEditorTreeEl.loadConfig(treeConfig);
    }

    #getCurrentElementConfig() {
        if (this.#editType === "area") {
            return this.#config.area[this.#editRef];
        }
        if (this.#editType === "exit") {
            return this.#config.exit[this.#editRef];
        }
        if (this.#editType === "location") {
            return this.#config.location[this.#editRef];
        }
    }

    #getEditor(type) {
        if (type === "area") {
            return this.#detailEditorAreaEl;
        }
        // if (type === "areaMapConfig") {
        //     return this.#detailEditorAreaMapConfigEl;
        // }
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

}

customElements.define("jse-world-editor", WorldEditor);
