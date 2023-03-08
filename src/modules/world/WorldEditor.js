import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import DefaultWorldConfigDataConverter from "./util/DefaultWorldConfigDataConverter.js";
import "./components/LocationDetailEditor.js";
import "./components/tree/StructureEditorTree.js";
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
        areaTags: {},
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

    #detailEditorLocationEl;

    #structureEditorTreeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#detailEditorLocationEl = this.shadowRoot.getElementById("detail-editor-location");
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
        this.#structureEditorTreeEl.addEventListener("editLocation", (event) => {
            this.#detailEditorLocationEl.classList.add("active");
            this.#editType = "location";
            this.#editRef = event.ref;
            const config = this.#getCurrentElementConfig();
            this.#detailEditorLocationEl.setData(config);
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

    #reloadTree() {
        const treeConfig = this.configDataConverter.extractTreeStructure(this.#config);
        this.#structureEditorTreeEl.loadConfig(treeConfig);
    }

    #getCurrentElementConfig() {
        if (this.#editType === "location") {
            return this.#config.location[this.#editRef];
        }
    }

}

customElements.define("jse-world-editor", WorldEditor);
