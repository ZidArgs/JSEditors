import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import "./components/tree/StructureEditorTree.js";
import TPL from "./WorldEditor.js.html" assert {type: "html"};
import STYLE from "./WorldEditor.js.css" assert {type: "css"};

// TODO dedicated area list editor (with own structure etc)

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

    #config = deepClone(DEFAULT_CONFIG);

    #structureEditorTreeEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#structureEditorTreeEl = this.shadowRoot.getElementById("structure-editor-tree");
        this.#structureEditorTreeEl.loadConfig(this.#config);
    }

    setConfig(config) {
        this.#config = deepClone(config);
        this.#structureEditorTreeEl.loadConfig(this.#config);
    }

    getConfig() {
        return deepClone(this.#config);
    }

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#structureEditorTreeEl.loadConfig(this.#config);
    }

}

customElements.define("jse-world-editor", WorldEditor);
