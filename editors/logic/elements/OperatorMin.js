import Template from "/emcJS/util/Template.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "MIN";
const TPL_BACKGROUND = "#ee82ee";
const TPL_BORDER = "#8b008b";

const TPL = new Template(`
    <style>
        :host {
            --logic-color-back: ${TPL_BACKGROUND};
            --logic-color-border: ${TPL_BORDER};
        }
    </style>
    <div id="header" class="header">${TPL_CAPTION}</div>
    <div class="body">
        <input id="input" type="number" value="0" />
    </div>
    <div class="body">
        <slot id="children">
            <span id="droptarget" class="placeholder">...</span>
        </slot>
    </div>
`);
const SVG = new Template(`
    <div class="logic-element" style="--logic-color-back: ${TPL_BACKGROUND}; --logic-color-border: ${TPL_BORDER};">
        <div id="header" class="header">${TPL_CAPTION}</div>
        <div class="body">
            <div class="input">
            </div>
        </div>
    </div>
`);

export default class OperatorMin extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        let target = this.shadowRoot.getElementById("droptarget");
        target.ondragover = AbstractElement.allowDrop;
        target.ondrop = AbstractElement.dropOnPlaceholder.bind(this);
        target.onclick = function(event) {
            let e = new Event('placeholderclicked');
            e.name = event.target.name;
            this.dispatchEvent(e);
            event.stopPropagation();
        }.bind(this);
    }

    calculate(state = {}) {
        let value;
        let ch = this.children;
        if (!!ch[0]) {
            let val = ch[0].calculate(state);
            if (typeof val != "undefined") {
                value = +(val >= this.shadowRoot.getElementById("input").value);
            }
        }
        this.shadowRoot.getElementById('header').setAttribute('value', value);
        return value;
    }

    toJSON() {
        return {
            type: "min",
            el: Array.from(this.children).slice(0,1).map(e => e.toJSON())[0],
            value: parseInt(this.shadowRoot.getElementById("input").value) || 0
        };
    }

    loadLogic(logic) {
        if (!!logic && !!logic.el) {
            this.shadowRoot.getElementById("input").value = parseInt(logic.value) || 0;
            let cl;
            if (!!logic.el.category) {
                cl = AbstractElement.getReference(logic.el.category, logic.el.type);
            } else {
                cl = AbstractElement.getReference(logic.el.type);
            }
            let el = new cl;
            el.loadLogic(logic.el);
            this.append(el);
        }
    }

    static getSVG(logic) {
        let el = SVG.generate().children[0];
        let cnt = el.querySelector(".body");
        let hdr = el.querySelector(".header");
        let inp = el.querySelector(".input");
        let newValue;
        if (!!logic && !!logic.el) {
            let el = AbstractElement.getReference(logic.el.type).getSVG(logic.el);
            if (typeof el.dataset.value != "undefined") {
                newValue = parseInt(el.dataset.value) >= logic.value;
            }
            cnt.append(el);
            inp.innerHTML = logic.value;
        }
        if (typeof newValue != "undefined") {
            el.dataset.value = +newValue;
            hdr.dataset.value = +newValue;
        }
        return el;
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'readonly':
                if (oldValue != newValue) {
                    let input = this.shadowRoot.getElementById('input');
                    if (newValue != null) {
                        input.setAttribute("disabled", newValue);
                    } else {
                        input.removeAttribute("disabled");
                    }
                }
                break;
        }
    }

}

AbstractElement.registerReference("min", OperatorMin);
customElements.define('ted-logic-min', OperatorMin);