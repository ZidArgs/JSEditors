import Template from "/emcJS/util/Template.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "STATE";
const TPL_BACKGROUND = "#ffffff";
const TPL_BORDER = "#777777";

const TPL = new Template(`
    <style>
        :host {
            --logic-color-back: ${TPL_BACKGROUND};
            --logic-color-border: ${TPL_BORDER};
        }
    </style>
    <div id="header" class="header">${TPL_CAPTION}</div>
    <div id="ref" class="body"></div>
    <div id="value" class="body"></div>
`);
const SVG = new Template(`
    <div class="logic-element" style="--logic-color-back: ${TPL_BACKGROUND}; --logic-color-border: ${TPL_BORDER};">
        <div class="header" data-value="0">${TPL_CAPTION}</div>
    </div>
`);

export default class LiteralState extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
    }

    get ref() {
        return this.getAttribute('ref');
    }

    set ref(val) {
        this.setAttribute('ref', val);
    }

    get value() {
        return this.getAttribute('value');
    }

    set value(val) {
        this.setAttribute('value', val);
    }

    get category() {
        return this.getAttribute('category');
    }

    set category(val) {
        this.setAttribute('category', val);
    }

    calculate(state = {}) {
        if (state.hasOwnProperty(this.ref)) {
            let val = !!this.value ? +(state[this.ref] == this.value) : +!!state[this.ref];
            this.shadowRoot.getElementById('header').setAttribute('value', val);
            return val;
        } else {
            this.shadowRoot.getElementById('header').setAttribute('value', "0");
            return 0;
        }
    }

    loadLogic(logic) {
        this.ref = logic.el;
        this.value = logic.value;
        this.category = logic.category || "";
    }

    toJSON() {
        if (!!this.category) {
            return {
                type: "state",
                el: this.ref,
                value: this.value,
                category: this.category
            };
        } else {
            return {
                type: "state",
                el: this.ref,
                value: this.value
            };
        }
    }

    static get observedAttributes() {
        let attr = AbstractElement.observedAttributes;
        attr.push('ref', 'value', 'category');
        return attr;
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'ref':
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById("ref").innerHTML = newValue;
                }
                break;
            case 'value':
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById("value").innerHTML = newValue;
                }
                break;
            case 'category':
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById('header').innerHTML = `${TPL_CAPTION}(${logic.category.toUpperCase()})`;
                }
                break;
        }
    }

    static getSVG(logic) {
        let el = SVG.generate().children[0];
        // TODO
        return el;
    }

}

AbstractElement.registerReference("state", LiteralState);
customElements.define('ted-logic-state', LiteralState);