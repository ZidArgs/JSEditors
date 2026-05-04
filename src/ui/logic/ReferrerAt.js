import HTMLTemplate from "@emcjs/fe/util/template/HTMLTemplate.js";
import AbstractElement from "./AbstractElement.js";

const TPL_CAPTION = "AT";
const TPL_BACKGROUND = "#66ffea";
const TPL_BORDER = "#24766b";
const REFERENCE = "at";

const TPL = new HTMLTemplate(`
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

export default class LogicElement extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        const target = this.shadowRoot.getElementById("droptarget");
        target.ondragover = AbstractElement.allowDrop;
        target.ondrop = AbstractElement.dropOnPlaceholder;
        target.onclick = (event) => {
            const e = new Event("placeholderclicked");
            e.name = event.target.name;
            this.dispatchEvent(e);
            event.stopPropagation();
        };
    }

    getElement(forceCopy = false) {
        const el = super.getElement(forceCopy);
        el.ref = this.ref;
        return el;
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
        let value;
        const ch = this.children;
        if (ch[0]) {
            value = +(!!state[this.ref] && ch[0].calculate(state));
        } else {
            value = +!!state[this.ref];
        }
        this.shadowRoot.getElementById("header").setAttribute("value", value);
        return value;
    }

    loadLogic(logic) {
        if (!!logic && !!logic.content) {
            this.ref = logic.node;
            let cl;
            if (logic.content.category) {
                cl = AbstractElement.getReference(logic.content.category, logic.content.type);
            } else {
                cl = AbstractElement.getReference(logic.content.type);
            }
            const el = new cl;
            el.loadLogic(logic.content);
            this.append(el);
        }
    }

    toJSON() {
        return {
            type: REFERENCE,
            node: this.ref,
            content: Array.from(this.children).slice(0, 1).map((e) => e.toJSON())[0]
        };
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
