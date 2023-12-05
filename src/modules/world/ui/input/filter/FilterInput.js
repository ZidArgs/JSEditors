import CustomFormElementDelegating from "/emcJS/ui/element/CustomFormElementDelegating.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import {
    isEqual
} from "/emcJS/util/helper/Comparator.js";
import {
    debounce
} from "/emcJS/util/Debouncer.js";
import EventMultiTargetManager from "/emcJS/util/event/EventMultiTargetManager.js";
import "./components/FilterInputGroup.js";
import TPL from "./FilterInput.js.html" assert {type: "html"};
import STYLE from "./FilterInput.js.css" assert {type: "css"};

export default class FilterInput extends CustomFormElementDelegating {

    #value = {};

    #eventTargetManager = new EventMultiTargetManager();

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#eventTargetManager.set("change", (event) => {
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

    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        const valueEls = this.querySelectorAll("jse-world-editor-input-filter-group");
        for (const valueEl of valueEls) {
            valueEl.disabled = disabled;
        }
    }

    formResetCallback() {
        super.formResetCallback();
        this.#value = deepClone(this.value);
        const valueEls = this.querySelectorAll("jse-world-editor-input-filter-group");
        for (const valueEl of valueEls) {
            const valueName = valueEl.dataset.name;
            const value = this.#value[valueName];
            valueEl.value = value ?? {};
        }
    }

    loadFilterConfig(config) {
        this.innerHTML = "";
        this.#eventTargetManager.clearTargets();
        for (const filterName in config) {
            const filterEl = document.createElement("jse-world-editor-input-filter-group");
            filterEl.dataset.name = filterName;
            filterEl.label = filterName;
            const filterValues = config[filterName];
            filterEl.loadFilterValues(filterValues);
            const currValue = this.#value?.[filterName];
            filterEl.value = currValue;
            this.append(filterEl);
            this.#eventTargetManager.addTarget(filterEl);
        }
    }

    set value(value) {
        if (!isEqual(this.#value, value)) {
            this.#value = deepClone(value);
            const valueEls = this.querySelectorAll("jse-world-editor-input-filter-group");
            for (const valueEl of valueEls) {
                const valueName = valueEl.dataset.name;
                const currValue = this.#value?.[valueName];
                valueEl.value = currValue;
            }
            this.#notifyValueChange();
        }
    }

    get value() {
        return this.#value;
    }

    #notifyValueChange = debounce(() => {
        const ev = new Event("change", {bubbles: true, cancelable: true});
        ev.value = this.#value;
        this.dispatchEvent(ev);
    });

}

customElements.define("jse-world-editor-input-filter", FilterInput);
