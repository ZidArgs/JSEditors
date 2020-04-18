import Template from "/emcJS/util/Template.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "TRUE";
const TPL_BACKGROUND = "lightgreen";
const TPL_BORDER = "green";

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
        <div class="header" data-value="1">${TPL_CAPTION}</div>
    </div>
`);

export default class LiteralTrue extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
    }

    calculate(state = {}) {
        this.shadowRoot.getElementById('header').setAttribute('value', "1");
        return 1;
    }

    loadLogic(logic) {}

    toJSON() {
        return {
            type: "true"
        };
    }

    static getSVG(logic) {
        return SVG.generate().children[0];
    }

}

AbstractElement.registerReference("true", LiteralTrue);
customElements.define('ted-logic-true', LiteralTrue);