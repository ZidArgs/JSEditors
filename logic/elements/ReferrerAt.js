import Template from "/emcJS/util/Template.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "AT";
const TPL_BACKGROUND = "#66ffea";
const TPL_BORDER = "#24766b";

const TPL = new Template(`
    <style>
        :host {
            --logic-color-back: ${TPL_BACKGROUND};
            --logic-color-border: ${TPL_BORDER};
        }
    </style>
    <div id="header" class="header">${TPL_CAPTION}</div>
    <div id="ref"  class="body"></div>
    <div class="body">
        <slot id="child">
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

export default class ReferrerAt extends AbstractElement {

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

    getElement(forceCopy = false) {
        let el = super.getElement(forceCopy);
        el.ref = this.ref;
        return el;
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
        let value;
        let ch = this.children;
        if (!!ch[0]) {
            value = +(!!state[this.ref] && ch[0].calculate(state));
        } else {
            value = +!!state[this.ref];
        }
        this.shadowRoot.getElementById('header').setAttribute('value', value);
        return value;
    }

    loadLogic(logic) {
        if (!!logic && !!logic.el) {
            this.ref = logic.node;
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

    toJSON() {
        return {
            type: "at",
            node: this.ref,
            el: this.children.slice(0,1).map(e => e.toJSON())[0]
        };
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

AbstractElement.registerReference("at", ReferrerAt);
customElements.define('ted-logic-at', ReferrerAt);