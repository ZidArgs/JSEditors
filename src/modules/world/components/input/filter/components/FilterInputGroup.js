import CustomElement from "/emcJS/ui/element/CustomElement.js";
import EventMultiTargetManager from "/emcJS/util/event/EventMultiTargetManager.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import {
    isEqual
} from "/emcJS/util/helper/Comparator.js";
import "/emcJS/ui/form/field/input/BoolOrLogicInput.js";
import "/emcJS/ui/i18n/I18nLabel.js";
import TPL from "./FilterInputGroup.js.html" assert {type: "html"};
import STYLE from "./FilterInputGroup.js.css" assert {type: "css"};

export default class FilterInputGroup extends CustomElement {

    #value = {};

    #eventTargetManager = new EventMultiTargetManager();

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#eventTargetManager.set("change", (event) => {
            event.stopPropagation();
        });
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

    loadFilterValues(valueNames) {
        this.innerHTML = "";
        this.#eventTargetManager.clearTargets();
        for (const valueName of valueNames) {
            const valueEl = document.createElement("emc-field-input-boolorlogic");
            valueEl.dataset.name = valueName;
            valueEl.label = valueName;
            const currValue = this.#value?.[valueName];
            valueEl.value = currValue === undefined ? true : currValue;
            this.append(valueEl);
            this.#eventTargetManager.addTarget(valueEl);
        }
    }

    set value(value) {
        if (!isEqual(this.#value, value)) {
            this.#value = deepClone(value);
            const valueEls = this.querySelectorAll("emc-field-input-boolorlogic");
            for (const valueEl of valueEls) {
                const valueName = valueEl.dataset.name;
                const currValue = this.#value?.[valueName];
                valueEl.value = currValue === undefined ? true : currValue;
            }
            /* --- */
            // TODO debounce?
            const ev = new Event("change", {bubbles: true, cancelable: true});
            ev.value = this.#value;
            this.dispatchEvent(ev);
        }
    }

    get value() {
        return this.#value;
    }

    set label(value) {
        this.setAttribute("label", value);
    }

    get label() {
        return this.getAttribute("label");
    }

    static get observedAttributes() {
        return ["label", "disabled"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "label": {
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById("legend").innerHTML = newValue;
                }
            } break;
            case "disabled": {
                if (oldValue != newValue) {
                    // safeSetAttribute(this.shadowRoot.getElementById("fieldset"), "disabled", newValue);
                }
            } break;
        }
    }

}

customElements.define("jse-world-editor-input-filter-group", FilterInputGroup);
