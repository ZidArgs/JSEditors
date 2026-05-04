import HTMLTemplate from "@emcjs/fe/util/template/HTMLTemplate.js";
import {
    appUID
} from "@emcjs/core/util/helper/UniqueGenerator.js";

const TPL = new HTMLTemplate(`
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
            background-color: var(--logic-color-back, white);
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
    </style>
`);

function dragStart(event) {
    event.dataTransfer.setData("layout-transfer-id", event.target.id);
}

const ID = new WeakMap();
const REG = new Map();

export default class AbstractElement extends HTMLElement {

    constructor() {
        super();
        if (new.target === AbstractElement) {
            throw new Error("can not construct abstract class");
        }
        this.attachShadow({mode: "open"});
        this.shadowRoot.append(TPL.generate());
        ID.set(this, appUID("layout-element"));
    }

    connectedCallback() {
        this.id = ID.get(this);
        this.setAttribute("draggable", "true");
        this.addEventListener("dragstart", dragStart);
    }

    disconnectedCallback() {
        this.removeAttribute("draggable");
        this.removeAttribute("id");
        this.removeEventListener("dragstart", dragStart);
    }

    getElement(forceCopy = false) {
        if (!!forceCopy || (typeof this.template == "string" && this.template != "false")) {
            const el = this.cloneNode(true);
            el.removeAttribute("template");
            return el;
        } else {
            return this;
        }
    }

    toJSON() {
        throw new Error("can not call abstract method");
    }

    append(el) {
        if (Array.isArray(el)) {
            el.forEach((e) => this.appendChild(e));
        } else {
            this.appendChild(el);
        }
    }

    prepend(el) {
        if (Array.isArray(el)) {
            el.forEach((e) => this.insertBefore(e, this.firstChild));
        } else {
            this.insertBefore(el, this.firstChild);
        }
    }

    appendChild(el) {
        if (el instanceof AbstractElement && (typeof this.template != "string" || this.template == "false")) {
            const r = super.appendChild(el);
            return r;
        }
    }

    insertBefore(el, ref) {
        if (el instanceof AbstractElement && (typeof this.template != "string" || this.template == "false")) {
            const r = super.insertBefore(el, ref);
            return r;
        }
    }

    get template() {
        return this.getAttribute("template");
    }

    set template(val) {
        this.setAttribute("template", val);
    }

    static registerReference(ref, clazz) {
        if (REG.has(ref)) {
            throw new Error(`reference ${ref} already exists`);
        }
        REG.set(ref, clazz);
    }

    static getReference(ref) {
        if (REG.has(ref)) {
            return REG.get(ref);
        }
        return LayoutError;
    }

    static buildLayout(layout) {
        if (typeof layout == "object" && !!layout) {
            if (Array.isArray(layout)) {
                return new LayoutError();
            } else {
                const el = new (AbstractElement.getReference(layout.type));
                el.loadLogic(layout);
                return el;
            }
        }
        return new (AbstractElement.getReference(`${layout}`));
    }

    static allowDrop(event) {
        const el = event.target.getRootNode().host;
        if ((typeof el.readOnly != "string" || el.readOnly == "false")
        &&  (typeof el.template != "string" || el.template == "false")) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

    static dropOnPlaceholder(event) {
        if (event.dataTransfer) {
            const id = event.dataTransfer.getData("logic-transfer-id");
            const el = document.getElementById(id);
            if (!!el && el instanceof AbstractElement) {
                const ne = event.target.getRootNode().host.append(el.getElement(event.ctrlKey));
                if (ne) {
                    const slot = event.target.parentNode;
                    if (slot instanceof HTMLSlotElement && slot.name != null) {
                        ne.setAttribute("slot", slot.name);
                    } else {
                        ne.removeAttribute("slot");
                    }
                }
            }
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

}

/**
 * for undefined references
 */
const TPL_E = new HTMLTemplate(`
    <style>
        .error {
            --logic-color-back: #ff0000;
            --logic-color-border: #770000;
            --logic-color-text: #ffffff;
        }
    </style>
    <span class="error">ERROR: REFERENCE NOT FOUND</span>
`);

class LayoutError extends AbstractElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL_E.generate());
    }

    getElement() {
        return this;
    }

    toJSON() {}

    buildLayout(/* layout */) {}

}

customElements.define("emc-layout-error", LayoutError);
