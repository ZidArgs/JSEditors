import CustomElement from "/emcJS/ui/element/CustomElement.js";
import "./components/AreaMarker.js";
import "./components/ConnectionMarker.js";
import "./components/ExitMarker.js";
import "./components/LocationMarker.js";
import TPL from "./MapPosInput.js.html" assert {type: "html"};
import STYLE from "./MapPosInput.js.css" assert {type: "css"};
import {
    debounce
} from "/emcJS/util/Debouncer.js";

// TODO use element manager
// TODO add current marker preview (class="active")
// - if x or y is empty: dont show preview marker
// TODO use form styles
// TODO scroll to current marker position

export default class MapPosInput extends CustomElement {

    #mapElement;

    #posXInputElement;

    #posYInputElement;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#mapElement = this.shadowRoot.getElementById("map");
        this.#posXInputElement = this.shadowRoot.getElementById("pos-x");
        this.#posYInputElement = this.shadowRoot.getElementById("pos-y");
        this.#mapElement.addEventListener("click", (event) => {
            const {clientX, clientY} = event;
            this.#posXInputElement.value = clientX;
            this.#posYInputElement.value = clientY;
        });
        this.#posXInputElement.addEventListener("change", () => {
            const currentEl = this.querySelector(".active");
            const value = this.#posXInputElement.value;
            currentEl.style.left = `${value}px`;
            this.#onChange();
        });
        this.#posYInputElement.addEventListener("change", () => {
            const currentEl = this.querySelector(".active");
            const value = this.#posYInputElement.value;
            currentEl.style.left = `${value}px`;
            this.#onChange();
        });
    }

    #onChange = debounce(() => {
        this.dispatchEvent(new Event("change"));
    });

    set value(value) {
        const {x, y} = value;
        this.#posXInputElement.value = x ?? "";
        this.#posYInputElement.value = y ?? "";
    }

    get value() {
        return {
            x: this.#posXInputElement,
            y: this.#posYInputElement
        };
    }

    loadData(map, connections, entries) {
        this.innerHTML = "";
        if (map != null) {
            const {color, background, width, height} = map;
            this.#mapElement.style.backgroundColor = color;
            this.#mapElement.style.backgroundImage = `url("${background}")`;
            this.#mapElement.style.width = `${width}px`;
            this.#mapElement.style.height = `${height}px`;
            this.#posXInputElement.value = width;
            this.#posYInputElement.value = height;
            for (const connectionName in connections ?? {}) {
                const connectionList = connections[connectionName];
                for (const index in connectionList) {
                    const connection = connectionList[index];
                    const el = document.createElement("jse-world-editor-input-position-marker-connection");
                    const {x, y} = connection;
                    el.label = connectionName;
                    el.x = x;
                    el.y = y;
                    el.dataset.ref = `${connectionName}.${index}`;
                    this.append(el);
                }
            }
            for (const index in entries) {
                const entry = entries[index];
                const {pos: {x, y} = {}, type} = entry;
                const el = document.createElement(`jse-world-editor-input-position-marker-${type}`);
                el.x = x;
                el.y = y;
                el.dataset.ref = `${index}[${type}]`;
                this.append(el);
            }
        } else {
            this.#mapElement.style.backgroundColor = "";
            this.#mapElement.style.backgroundImage = "";
            this.#mapElement.style.width = "0px";
            this.#mapElement.style.height = "0px";
            this.#posXInputElement.max = 0;
            this.#posYInputElement.max = 0;
        }
    }

}

customElements.define("jse-world-editor-input-position-map", MapPosInput);
