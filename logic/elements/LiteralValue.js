import Template from "/emcJS/util/Template.js";
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
    <div id="value" class="body"></div>
`);
const SVG = new Template(`
    <div class="logic-element" style="--logic-color-back: ${TPL_BACKGROUND}; --logic-color-border: ${TPL_BORDER};">
        <div class="header" data-value="0">${TPL_CAPTION}</div>
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
        this.shadowRoot.getElementById("ref").innerHTML = this.ref;
        this.value = logic.value;
        this.shadowRoot.getElementById('value').innerHTML = this.value;
        this.category = logic.category;
        if (!!logic.category) {
            this.shadowRoot.getElementById('header').innerHTML = `${TPL_CAPTION}(${logic.category.toUpperCase()})`;
        }
    }

    toJSON() {
        if (!!this.category) {
            return {
                type: "value",
                el: this.ref,
                value: this.value,
                category: this.category
            };
        } else {
            return {
                type: "value",
                el: this.ref,
                value: this.value
            };
        }
    }

    static getSVG(logic) {
        return SVG.generate().children[0];
    }

}

AbstractElement.registerReference("value", LiteralValue);
customElements.define('ted-logic-value', LiteralValue);