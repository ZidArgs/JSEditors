import TypeStorage from "/emcJS/data/type/TypeStorage.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";

const DEFAULT_CONFIG = {
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
};

class WorldEditorScope extends EventTarget {

    #config = deepClone(DEFAULT_CONFIG);

    #locationStorage = new TypeStorage("Location");

    #collectionStorage = new TypeStorage("Collection");

    #areaStorage = new TypeStorage("Area");

    #exitStorage = new TypeStorage("Exit");

    #editorType = "";

    #editorName = "";

    #treePath = [];

    #editPath = [];

    #filterConfig = {};

    reset() {
        this.#config = deepClone(DEFAULT_CONFIG);
        this.#locationStorage.clear();
        this.#collectionStorage.clear();
        this.#areaStorage.clear();
        this.#exitStorage.clear();
        /* --- */
        this.#treePath = [];
        this.#editPath = [];
        this.#editorType = "";
        this.#editorName = "";
    }

    setData(value) {
        this.#config = deepClone(value.config);
        this.#locationStorage.setAll(value.locations);
        this.#collectionStorage.setAll(value.collections);
        this.#areaStorage.setAll(value.areas);
        this.#exitStorage.setAll(value.exits);
    }

    set config(value) {
        this.#config = deepClone(value);
    }

    get config() {
        return this.#config;
    }

    get locationStorage() {
        return this.#locationStorage;
    }

    get collectionStorage() {
        return this.#collectionStorage;
    }

    get areaStorage() {
        return this.#areaStorage;
    }

    get exitStorage() {
        return this.#exitStorage;
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

window.worldEditorScope = scope;

export default scope;
