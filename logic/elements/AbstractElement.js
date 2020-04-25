import DragDropMemory from "/emcJS/util/DragDropMemory.js";
import Template from "/emcJS/util/Template.js";
import UGen from "/emcJS/util/UniqueGenerator.js";

const TPL = new Template(`
    <style>
        * {
            position: relative;
            box-sizing: border-box;
        }
        :host {
            display: table;
            margin: 5px;
            user-select: none;
            border-radius: 5px;
            cursor: move;
            font-family: monospace;
            background: var(--logic-color-back, white);
            border-width: 1px;
            border-style: solid;
            color: var(--logic-color-text, black);
            border-color: var(--logic-color-border, black);
            -webkit-user-select: none;
            user-select: none;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 35px;
            padding: 5px;
            user-select: none;
        }
        .header[value]:before {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 16px;
            font-size: 12px;
            line-height: 10px;
            margin-right: 5px;
            border-radius: 10px;
            border: solid 2px black;
            background-color: #85ff85;
            content: attr(value);
        }
        .header[value="0"]:before {
            background-color: #ff8585;
        }
        .body {
            display: block;
            padding: 5px;
            border-top-width: 1px;
            border-top-style: solid;
            border-color: var(--logic-color-border, black);
        }
        .body input {
            width: 100px;
            height: 25px;
            text-align: right;
            margin: 0 5px;
        }
        .placeholder {
            display: table;
            margin: 5px;
            padding: 5px 20px;
            background-color: lightgray;
            border: 1px solid gray;
            font-weight: bold;
            cursor: pointer;
        }
        :host([readonly]:not([readonly="false"])) {
            cursor: default;
        }
        :host([readonly]:not([readonly="false"])) .placeholder {
            display: none;
        }
        :host([readonly]:not([readonly="false"])) input,
        :host([readonly]:not([readonly="false"])) select,
        :host([template]:not([template="false"])) input,
        :host([template]:not([template="false"])) select {
            pointer-events: none;
        }
    </style>
`);

const SVG = new Template(`
    <svg xmlns="http://www.w3.org/2000/svg">
        <style>
            .logic-element {
                position: relative;
                box-sizing: border-box;
                line-height: 1em;
                display: table;
                margin: 5px;
                border-radius: 5px;
                font-size: 14px;
                background: var(--logic-color-back, white);
                border-width: 1px;
                border-style: solid;
                color: var(--logic-color-text, black);
                border-color: var(--logic-color-border, black);
                -webkit-user-select: none;
                user-select: none;
            }
            .logic-element > .header {
                position: relative;
                box-sizing: border-box;
                line-height: 1em;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                height: 35px;
                padding: 5px;
                user-select: none;
            }
            .logic-element > .header:before {
                position: relative;
                box-sizing: border-box;
                line-height: 1em;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 16px;
                font-size: 12px;
                line-height: 10px;
                margin-right: 5px;
                border-radius: 10px;
                border: solid 2px black;
                background-color: #ecff85;
                content: "n/a";
            }
            .logic-element > .header[data-value]:before {
                background-color: #85ff85;
                content: attr(data-value);
            }
            .logic-element > .header[data-value="0"]:before {
                background-color: #ff8585;
            }
            .logic-element > .body {
                position: relative;
                box-sizing: border-box;
                line-height: 1em;
                display: block;
                padding: 5px;
                border-top-width: 1px;
                border-top-style: solid;
                border-color: var(--logic-color-border, black);
            }
            .logic-element > .body > .input {
                position: relative;
                box-sizing: border-box;
                line-height: 1em;
                width: 100px;
                height: 25px;
                text-align: right;
                margin: 0 5px;
                padding: 5px;
                color: black;
                background-color: white;
            }
        </style>
        <foreignobject xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" x="0" y="0">
        </foreignobject>
    </svg>
`);

function dragStart(event) {
    DragDropMemory.add(event.currentTarget);
    event.stopPropagation();
}

// TODO add on placeholder click dialog to append logic elements
const ID = new WeakMap();
const REG = new Map();

export default class AbstractElement extends HTMLElement {

    constructor() {
        super();
        if (new.target === AbstractElement) {
            throw new TypeError("can not construct abstract class");
        }
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        ID.set(this, UGen.appUID("logic-element"));
    }

    connectedCallback() {
        if (this.readonly === null || this.readonly == "false") {
            this.setAttribute("draggable", "true");
        }
        this.id = ID.get(this);
        this.addEventListener("dragstart", dragStart);
    }

    disconnectedCallback() {
        this.removeAttribute("draggable");
        this.removeAttribute("id");
        this.removeEventListener("dragstart", dragStart);
    }

    getElement(forceCopy = false) {
        if (!!forceCopy || (typeof this.template == "string" && this.template != "false")) {
            let el = this.cloneNode(true);
            el.removeAttribute('template');
            return el;
        } else {
            return this;
        }
    }

    calculate(state = {}) {
        throw new TypeError("can not call abstract method");
    }

    loadLogic() {
        throw new TypeError("can not call abstract method");
    }

    toJSON() {
        throw new TypeError("can not call abstract method");
    }

    append(el) {
        if (Array.isArray(el)) {
            el.forEach(e => this.appendChild(e));
        } else {
            this.appendChild(el);
        }
    }

    prepend(el) {
        if (Array.isArray(el)) {
            el.forEach(e => this.insertBefore(e, this.firstChild));
        } else {
            this.insertBefore(el, this.firstChild);
        }
    }
    
    appendChild(el) {
        if (el instanceof AbstractElement && (typeof this.template != "string" || this.template == "false")) {
            let r = super.appendChild(el);

            if (this.hasAttribute("visualize")) {
                r.setAttribute("visualize", this.getAttribute("visualize"));
            } else {
                r.removeAttribute("visualize");
            }
            if (this.hasAttribute("readonly")) {
                r.setAttribute("readonly", this.getAttribute("readonly"));
            } else {
                r.removeAttribute("readonly");
            }

            return r;
        }
    }

    insertBefore(el, ref) {
        if (el instanceof AbstractElement && (typeof this.template != "string" || this.template == "false")) {
            let r = super.insertBefore(el, ref);

            if (this.hasAttribute("visualize")) {
                r.setAttribute("visualize", this.getAttribute("visualize"));
            } else {
                r.removeAttribute("visualize");
            }
            if (this.hasAttribute("readonly")) {
                r.setAttribute("readonly", this.getAttribute("readonly"));
            } else {
                r.removeAttribute("readonly");
            }

            return r;
        }
    }

    get template() {
        return this.getAttribute('template');
    }

    set template(val) {
        this.setAttribute('template', val);
    }

    get value() {
        let val = this.getAttribute('value');
        if (val == null) {
            return undefined;
        }
        return parseInt(val) || 0;
    }

    set value(val) {
        let hdr = this.shadowRoot.querySelector(".header");
        if (typeof val == "undefined") {
            this.removeAttribute('value');
            if (!!hdr) delete hdr.dataset.value;
        } else if (typeof val == "boolean") {
            this.setAttribute('value', +val);
            if (!!hdr) hdr.dataset.value = +val;
        } else {
            this.setAttribute('value', parseInt(val) || 0);
            if (!!hdr) hdr.dataset.value = parseInt(val) || 0;
        }
    }

    get readonly() {
        return this.getAttribute('readonly');
    }

    set readonly(val) {
        this.setAttribute('readonly', val);
    }

    static get observedAttributes() {
        return ['readonly', 'value', 'visualize'];
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'readonly':
                if (oldValue != newValue) {
                    if (newValue === null || newValue == "false") {
                        this.setAttribute("draggable", "true");
                    } else {
                        this.removeAttribute("draggable");
                    }
                    for (let ch of this.children) {
                        ch.readonly = newValue;
                    }
                }
                break;
            case 'value':
                if (oldValue != newValue) {
                    let event = new Event('update');
                    event.value = this.value;
                    this.dispatchEvent(event);
                }
                break;
            case 'visualize':
                if (oldValue != newValue) {
                    for (let ch of this.children) {
                        ch.visualize = newValue;
                    }
                }
                break;
        }
    }

    static registerReference(ref, clazz) {
        if (REG.has(ref)) {
            throw new Error(`reference ${ref} already exists`);
        }
        REG.set(ref, clazz);
    }

    static getReference(...refs) {
        for (let ref of refs) {
            if (REG.has(ref)) {
                return REG.get(ref);
            }
        }
        return LogicError;
    }

    static buildLogic(logic) {
        if (typeof logic == "object" && !!logic) {
            if (Array.isArray(logic)) {
                return new LogicError();
            } else {
                let cl;
                if (!!logic.category) {
                    cl = AbstractElement.getReference(logic.category, logic.type);
                } else {
                    cl = AbstractElement.getReference(logic.type);
                }
                let el = new cl;
                el.loadLogic(logic);
                return el;
            }
        }
        return new (AbstractElement.getReference(`${logic}`));
    }

    static buildSVG(logic) {
        let svg = SVG.generate().children[0];
        let cnt = svg.querySelector('foreignobject');
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        document.body.append(svg);
        if (!!logic) {
            let el = buildVisual(logic);
            cnt.append(el);
            svg.setAttributeNS('', 'width', `${el.clientWidth + 10}`);
            svg.setAttributeNS('', 'height', `${el.clientHeight + 10}`);
        }
        svg.style.position = "";
        svg.style.top = "";
        svg.style.left = "";
        document.body.removeChild(svg);
        return svg;
    }

    static allowDrop(event) {
        let el = event.target.getRootNode().host;
        if ((typeof el.readonly != "string" || el.readonly == "false")
        &&  (typeof el.template != "string" || el.template == "false")) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

    static dropOnPlaceholder(event) {
        let els = DragDropMemory.get();
        if (!!els.length) {
            let el = els[0];
            if (!!el && el instanceof AbstractElement) {
                let ne = event.target.getRootNode().host.append(el.getElement(event.ctrlKey));
                if (!!ne) {
                    let slot = event.target.parentNode;
                    if (slot instanceof HTMLSlotElement && slot.name != null) {
                        ne.setAttribute("slot", slot.name);
                    } else {
                        ne.removeAttribute("slot");
                    }
                }
            }
        }
        DragDropMemory.clear();
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

}

function buildVisual(logic) {
    if (typeof logic == "object" && !!logic) {
        if (Array.isArray(logic)) {
            LogicError.getSVG(logic);
        } else {
            return AbstractElement.getReference(logic.type).getSVG(logic);
        }
    } else {
        return AbstractElement.getReference(`${logic}`).getSVG(logic);
    }
}


/**
 * for undefined references
 */
const TPL_E = new Template(`
    <style>
        :host {
            --logic-color-back: #ff0000;
            --logic-color-border: #770000;
            --logic-color-text: #ffffff;
        }
    </style>
    <div class="header">ERROR: REFERENCE NOT FOUND</div>
`);
const SVG_E = new Template(`
    <div class="logic-element" style="--logic-color-back: #ff0000; --logic-color-border: #770000; --logic-color-text: #ffffff;">
        <div class="header">ERROR: REFERENCE NOT FOUND</div>
        <div id="ref" class="body"></div>
    </div>
`);

class LogicError extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL_E.generate());
    }

    getElement() {
        return this;
    }

    get value() {}

    update() {}

    visualizeValue() {}

    toJSON() {}

    static getSVG() {
        return SVG_E.generate();
    }

    loadLogic(logic) {
        if (!!logic.category) {
            this.shadowRoot.getElementById('ref').innerHTML = `${logic.type.toUpperCase()}(${logic.category.toUpperCase()})`;
        } else {
            this.shadowRoot.getElementById("ref").innerHTML = logic.type.toUpperCase()
        }
    }

}

customElements.define('ted-logic-error', LogicError);