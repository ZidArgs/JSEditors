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
            incomingPrefix: "",
            incomingPostfix: "",
            outgoingPrefix: "",
            outgoingPostfix: "",
            variants: []
        }
    },
    locations: {},
    connections: {},
    areas: {},
    exits: {}
};

class WorldEditorScope extends EventTarget {

    #config = deepClone(DEFAULT_CONFIG);

    #treePath = [];

    #editPath = [];

    #filterConfig = {};

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

    set treePath(value) {
        this.#treePath = [...value];
    }

    get treePath() {
        return [...this.#treePath];
    }

    set editPath(value) {
        this.#editPath = [...value];
    }

    get editPath() {
        return [...this.#editPath];
    }

    set filterConfig(config) {
        this.#filterConfig = deepClone(config);
    }

    get filterConfig() {
        return this.#filterConfig;
    }

}

const scope = new WorldEditorScope();

export default scope;
