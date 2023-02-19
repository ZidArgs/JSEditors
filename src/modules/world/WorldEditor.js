import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import DefaultWorldConfigDataConverter from "./util/DefaultWorldConfigDataConverter.js";
import "./components/tree/StructureEditorTree.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};

// TODO dedicated area list editor (with own structure etc)

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

    #structureEditorTreeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#reloadTree();
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
        this.#structureEditorTreeEl.loadConfig(this.configDataConverter.extractTreeStructure(this.#config));
    }

}

customElements.define("jse-world-editor", WorldEditor);
