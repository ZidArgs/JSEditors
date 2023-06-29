import CustomElement from "/emcJS/ui/element/CustomElement.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import {
    isEqual
} from "/emcJS/util/helper/Comparator.js";
import EventMultiTargetManager from "/emcJS/util/event/EventMultiTargetManager.js";
import "./components/FilterInputGroup.js";
import TPL from "./FilterInput.js.html" assert {type: "html"};
import STYLE from "./FilterInput.js.css" assert {type: "css"};

// TODO extend CustomFormElementDelegating
export default class FilterInput extends CustomElement {

    #value = {};

    #eventTargetManager = new EventMultiTargetManager();

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#eventTargetManager.set("value", (event) => {
            event.stopPropagation();
            const valueEl = event.target;
            const valueName = valueEl.dataset.name;
            const value = event.value;
            this.value = {
                ...this.#value,
                [valueName]: value
            };
        });
    }

    loadFilterConfig(config) {
        this.innerHTML = "";
        this.#eventTargetManager.clearTargets();
        for (const filterName in config) {
            const filterEl = document.createElement("jse-world-editor-input-filter-group");
            filterEl.dataset.name = filterName;
            filterEl.label = filterName;
            const filterValues = config[filterName].values;
            filterEl.loadFilterValues(filterValues);
            const value = this.#value[filterName];
            filterEl.value = value;
            this.#eventTargetManager.addTarget(filterEl);
            this.append(filterEl);
        }
    }

    set value(value) {
        if (!isEqual(this.#value, value)) {
            this.#value = deepClone(value);
            const valueEls = this.querySelectorAll("jse-world-editor-input-filter-group");
            for (const valueEl of valueEls) {
                const valueName = valueEl.dataset.name;
                const value = this.#value[valueName];
                valueEl.value = value ?? {};
            }
            /* --- */
            // TODO debounce?
            const ev = new Event("value", {bubbles: true, cancelable: true});
            ev.value = this.#value;
            this.dispatchEvent(ev);
        }
    }

    get value() {
        return this.#value;
    }

}

customElements.define("jse-world-editor-input-filter", FilterInput);
