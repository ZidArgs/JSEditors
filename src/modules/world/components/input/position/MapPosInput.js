import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    debounce
} from "/emcJS/util/Debouncer.js";
import "./components/AreaMarker.js";
import "./components/ConnectionMarker.js";
import "./components/ExitMarker.js";
import "./components/LocationMarker.js";
import TPL from "./MapPosInput.js.html" assert {type: "html"};
import STYLE from "./MapPosInput.js.css" assert {type: "css"};

// TODO use element manager
// TODO add current marker preview (class="active")
// TODO if x or y is empty: dont show preview marker
// TODO use form styles
// TODO scroll to current marker position
// TODO add "remove position"-button

export default class MapPosInput extends CustomElement {

    #mapElement;

    #posXInputElement;

    #posYInputElement;

    #currentMarkerType;

    #currentMarkerIndex;

    #currentMarkerLabel;

    #currentMarkerEl;

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
            const value = this.#posXInputElement.value;
            this.#currentMarkerEl.x = value;
            this.#onChange();
        });
        this.#posYInputElement.addEventListener("change", () => {
            const value = this.#posYInputElement.value;
            this.#currentMarkerEl.y = value;
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
        if (this.#currentMarkerEl) {
            this.#currentMarkerEl.x = x;
            this.#currentMarkerEl.y = y;
        } else {
            this.#currentMarkerEl = this.#createMarker(this.#currentMarkerType, this.#currentMarkerIndex, x, y, this.#currentMarkerLabel);
            if (this.#currentMarkerEl) {
                this.#currentMarkerEl.classList.add("active");
            }
        }
    }

    get value() {
        return {
            x: this.#posXInputElement,
            y: this.#posYInputElement
        };
    }

    loadData(map, connections, entries, currentType, currentIndex, currentLabel) {
        this.#currentMarkerType = currentType;
        this.#currentMarkerIndex = currentIndex;
        this.#currentMarkerLabel = currentLabel;
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
                    const {x, y} = connection;
                    this.#createMarker("connection", index, x, y, connectionName);
                }
            }
            for (const index in entries) {
                const entry = entries[index];
                const {pos: {x, y} = {}, type} = entry;
                this.#createMarker(type, index, x, y);
            }
            this.#currentMarkerEl = this.querySelector(`${currentType}[${currentIndex}]`);
            if (this.#currentMarkerEl) {
                this.#currentMarkerEl.classList.add("active");
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

    #createMarker(type, index, x, y, label) {
        if (!isNaN(x) && !isNaN(y)) {
            const el = document.createElement(`jse-world-editor-input-position-marker-${type}`);
            el.x = x;
            el.y = y;
            el.dataset.ref = `${type}[${index}]`;
            if (label != null) {
                el.label = label;
            }
            this.append(el);
            return el;
        }
    }

}

customElements.define("jse-world-editor-input-position-map", MapPosInput);
