import Template from "../../util/Template.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "XOR";
const TPL_BACKGROUND = "#ffa500";
const TPL_BORDER = "#774455";

const TPL = new Template(`
    <style>
        :host {
            --logic-color-back: ${TPL_BACKGROUND};
            --logic-color-border: ${TPL_BORDER};
        }
    </style>
    <div id="header" class="header">${TPL_CAPTION}</div>
    <div class="body">
        <slot id="child0" name="slot0">
            <span id="droptarget0" class="placeholder">...</span>
        </slot>
        <slot id="child1" name="slot1">
            <span id="droptarget1" class="placeholder">...</span>
        </slot>
    </div>
`);
const SVG = new Template(`
    <div class="logic-element" style="--logic-color-back: ${TPL_BACKGROUND}; --logic-color-border: ${TPL_BORDER};">
        <div id="header" class="header">${TPL_CAPTION}</div>
        <div class="body"></div>
    </div>
`);

export default class OperatorXor extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        let target0 = this.shadowRoot.getElementById("droptarget0");
        let target1 = this.shadowRoot.getElementById("droptarget1");
        target0.ondragover = AbstractElement.allowDrop;
        target1.ondragover = AbstractElement.allowDrop;
        target0.ondrop = AbstractElement.dropOnPlaceholder.bind(this);
        target1.ondrop = AbstractElement.dropOnPlaceholder.bind(this);
        target1.onclick = target0.onclick = function(event) {
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
                value = +val;
            }
        }
        if (!!ch[1]) {
            let val = ch[1].calculate(state);
            if (typeof val != "undefined") {
                value = +(value != +val);
            }
        }
        this.shadowRoot.getElementById('header').setAttribute('value', value);
        return value;
    }

    update() {
        let newValue;
        let ch = this.children;
        if (!!ch[0] && typeof ch[0].value != "undefined") {
            if (!!ch[1] && typeof ch[1].value != "undefined") {
                newValue = +(!!ch[0].value != !!ch[1].value);
            } else {
                newValue = +!!ch[0].value;
            }
        }
        this.value = newValue;
    }

    toJSON() {
        return {
            type: "xor",
            el: Array.from(this.children).slice(0,2).map(e => e.toJSON())
        };
    }

    loadLogic(logic) {
        if (!!logic && Array.isArray(logic.el)) {
            for (let i = 0; i < logic.el.length && i < 2; ++i) {
                let ch = logic.el[i];
                if (!!ch) {
                    let cl;
                    if (!!ch.category) {
                        cl = AbstractElement.getReference(ch.category, ch.type);
                    } else {
                        cl = AbstractElement.getReference(ch.type);
                    }
                    let el = new cl;
                    el.loadLogic(ch);
                    this.append(el);
                }
            }
        }
    }

    static getSVG(logic) {
        let el = SVG.generate().children[0];
        let cnt = el.querySelector(".body");
        let hdr = el.querySelector(".header");
        let newValue;
        if (!!logic) {
            if (!!logic.el0) {
                let el0 = AbstractElement.getReference(logic.el0.type).getSVG(logic.el0);
                if (typeof el0.dataset.value != "undefined") {
                    newValue = !!parseInt(el.dataset.value);
                }
                cnt.append(el0);
            }
            if (!!logic.el1) {
                let el1 = AbstractElement.getReference(logic.el1.type).getSVG(logic.el1);
                if (typeof el1.dataset.value != "undefined") {
                    if (typeof newValue != "undefined") {
                        newValue = newValue ^ !!parseInt(el.dataset.value);
                    } else {
                        newValue = !!parseInt(el.dataset.value);
                    }
                }
                cnt.append(el1);
            }
        }
        if (typeof newValue != "undefined") {
            el.dataset.value = +newValue;
            hdr.dataset.value = +newValue;
        }
        return el;
    }

}

AbstractElement.registerReference("xor", OperatorXor);
customElements.define('ted-logic-xor', OperatorXor);