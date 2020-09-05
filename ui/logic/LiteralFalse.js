import Template from "/emcJS/util/Template.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "FALSE";
const TPL_BACKGROUND = "#fb7c7c";
const TPL_BORDER = "#650000";

const TPL = new Template(`
    <style>
        :host {
            --logic-color-back: ${TPL_BACKGROUND};
            --logic-color-border: ${TPL_BORDER};
        }
    </style>
    <div id="header" class="header">${TPL_CAPTION}</div>
`);
const SVG = new Template(`
    <div class="logic-element" style="--logic-color-back: ${TPL_BACKGROUND}; --logic-color-border: ${TPL_BORDER};">
        <div class="header" data-value="0">${TPL_CAPTION}</div>
    </div>
`);

export default class LiteralFalse extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
    }

    calculate(state = {}) {
        this.shadowRoot.getElementById('header').setAttribute('value', "0");
        return 0;
    }

    loadLogic(logic) {}

    toJSON() {
        return {
            type: "false"
        };
    }

    static getSVG(logic) {
        return SVG.generate().children[0];
    }

}

AbstractElement.registerReference("false", LiteralFalse);
customElements.define('jse-logic-false', LiteralFalse);