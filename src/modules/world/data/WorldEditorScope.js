import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";

const DEFAULT_CONFIG = {
    config: {
        defaultArea: "",
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

class WorldEditorScope {

    #config = deepClone(DEFAULT_CONFIG);

    #editPath = [];

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#editPath = [];
    }

    set config(value) {
        this.#config = deepClone(value);
    }

    get config() {
        return this.#config;
    }

    set editPath(value) {
        this.#editPath = [...value];
    }

    get editPath() {
        return [...this.#editPath];
    }

}

const scope = new WorldEditorScope();

export default scope;
