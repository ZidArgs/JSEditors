import HTMLTemplate from "@emcjs/fe/util/template/HTMLTemplate.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "VALUE";
const TPL_BACKGROUND = "#ffffff";
const TPL_BORDER = "#777777";
const REFERENCE = "value";

const TPL = new HTMLTemplate(`
    <style>
        :host {
            --logic-color-back: ${TPL_BACKGROUND};
            --logic-color-border: ${TPL_BORDER};
        }
    </style>
    <div id="header" class="header">${TPL_CAPTION}</div>
    <div id="ref" class="body"></div>
`);

export default class LogicElement extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
    }

    get ref() {
        return this.getAttribute("ref");
    }

    set ref(val) {
        this.setAttribute("ref", val);
    }

    get category() {
        return this.getAttribute("category");
    }

    set category(val) {
        this.setAttribute("category", val);
    }

    calculate(state = {}) {
        if (state[this.ref] != null) {
            const val = +!!state[this.ref];
            this.shadowRoot.getElementById("header").setAttribute("value", val);
            return val;
        }
        this.shadowRoot.getElementById("header").setAttribute("value", "0");
        return 0;
    }

    loadLogic(logic) {
        this.ref = logic.ref;
        this.category = logic.category || "";
    }

    toJSON() {
        if (this.category) {
            return {
                type: REFERENCE,
                ref: this.ref,
                category: this.category
            };
        } else {
            return {
                type: REFERENCE,
                ref: this.ref
            };
        }
    }

    static get observedAttributes() {
        const superObserved = super.observedAttributes ?? [];
        return [
            ...superObserved,
            "ref",
            "category"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback?.(name, oldValue, newValue);
        switch (name) {
            case "ref":
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById("ref").innerHTML = newValue;
                }
                break;
            case "category":
                if (oldValue != newValue) {
                    if (newValue !== "") {
                        this.shadowRoot.getElementById("header").innerHTML = `${TPL_CAPTION}(${newValue.toUpperCase()})`;
                    } else {
                        this.shadowRoot.getElementById("header").innerHTML = TPL_CAPTION;
                    }
                }
                break;
        }
    }

}

AbstractElement.registerReference(REFERENCE, LogicElement);
customElements.define(`jse-logic-${REFERENCE}`, LogicElement);
