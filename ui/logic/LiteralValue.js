import Template from "../../util/Template.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "VALUE";
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
`);
const SVG = new Template(`
    <div class="logic-element" style="--logic-color-back: ${TPL_BACKGROUND}; --logic-color-border: ${TPL_BORDER};">
        <div class="header" data-value="0">${TPL_CAPTION}</div>
        <div id="ref" class="body"></div>
    </div>
`);

export default class LiteralValue extends AbstractElement {

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

    get category() {
        return this.getAttribute('category');
    }

    set category(val) {
        this.setAttribute('category', val);
    }

    calculate(state = {}) {
        if (state.hasOwnProperty(this.ref)) {
            let val = +!!state[this.ref];
            this.shadowRoot.getElementById('header').setAttribute('value', val);
            return val;
        }
        this.shadowRoot.getElementById('header').setAttribute('value', "0");
        return 0;
    }

    loadLogic(logic) {
        this.ref = logic.el;
        this.category = logic.category || "";
    }

    toJSON() {
        if (!!this.category) {
            return {
                type: "value",
                el: this.ref,
                category: this.category
            };
        } else {
            return {
                type: "value",
                el: this.ref
            };
        }
    }

    static get observedAttributes() {
        let attr = AbstractElement.observedAttributes;
        attr.push('ref', 'category');
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
            case 'category':
                if (oldValue != newValue) {
                    if (newValue !== "") {
                        this.shadowRoot.getElementById('header').innerHTML = `${TPL_CAPTION}(${newValue.toUpperCase()})`;
                    } else {
                        this.shadowRoot.getElementById('header').innerHTML = TPL_CAPTION;
                    }
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

AbstractElement.registerReference("value", LiteralValue);
customElements.define('ted-logic-value', LiteralValue);