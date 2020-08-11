import Template from "../util/Template.js";
import "./ListHeader.js";
import "./Option.js";

const TPL = new Template(`
    <style>
        * {
            position: relative;
            box-sizing: border-box;
        }
        :host {
            display: flex;
            flex-direction: column;
            min-width: 200px;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }
        #view {
            height: 30px;
            padding: 0px 7px;
            font-size: inherit;
        }
        #scroll-container {
            position: absolute;
            display: none;
            height: 300px;
            width: 100%;
            margin-top: 30px;
            overflow-x: hidden;
            overflow-y: auto;
            background-color: var(--list-color-back, #ffffff);
            scrollbar-color: var(--list-color-hover, #b8b8b8) var(--list-color-border, #f1f1f1);
            z-index: 1000;
        }
        #scroll-container::-webkit-scrollbar-track {
            background-color: var(--list-color-border, #f1f1f1);
        }
        #scroll-container::-webkit-scrollbar-thumb {
            background-color: var(--list-color-hover, #b8b8b8);
        }
        slot {
            display: block;
            width: 100%;
        }
        ::slotted([value]) {
            display: flex;
            align-items: center;
            min-height: 30px;
            padding: 5px 10px;
            white-space: normal;
            color: var(--list-color-front, #000000);
            background-color: var(--list-color-back, #ffffff);
            border-bottom: solid 1px #eee;
        }
        ::slotted([value][disabled]) {
            display: none;
        }
        ::slotted([value]:hover) {
            background-color: var(--list-color-hover, #b8b8b8);
        }
        :host(:not([readonly])) ::slotted([value]:not(.active)),
        :host([readonly="false"]) ::slotted([value]:not(.active)),
        :host([multimode]:not([multimode="false"]):not([readonly])) ::slotted([value].active),
        :host([readonly="false"][multimode]:not([multimode="false"])) ::slotted([value].active) {
            cursor: pointer;
        }
        #empty {
            display: flex;
            align-items: center;
            justify-content: center;
            font-style: italic;
            min-height: 30px;
            padding: 5px;
            margin: 5px 2px;
            white-space: normal;
        }
    </style>
    <input id="view" placeholder="Search..."></input>
    <div id="scroll-container">
        <slot id="container">
            <div id="empty">no entries</div>
        </slot>
    </div>
`);

function clickOption(event) {
    if (!this.readonly) {
        this.value = event.currentTarget.getAttribute("value");
        let container = this.shadowRoot.getElementById("scroll-container");
        container.style.display = "";
    }
}

export default class SearchSelect extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        this.shadowRoot.getElementById("container").addEventListener("slotchange", event => {
            let all = this.querySelectorAll(`[value]`);
            all.forEach(el => {
                if (!!el) {
                    el.onclick = clickOption.bind(this);
                }
            });
        });
        let input = this.shadowRoot.getElementById("view");
        let container = this.shadowRoot.getElementById("scroll-container");
        this.addEventListener("focus", event => {
            if (!this.readonly) {
                input.focus();
            }
        });
        input.addEventListener("focus", event => {
            if (!this.readonly) {
                input.value = "";
                container.style.display = "block";
            }
        });
        this.addEventListener("blur", event => {
            input.value = this.value;
            container.style.display = "";
        });
        input.addEventListener("keyup", event => {
            let all = this.querySelectorAll(`[value]`);
            let regEx = new RegExp(`.*${input.value.split(" ").join(".*")}.*`, "i");
            all.forEach(el => {
                if (el.innerText.match(regEx)) {
                    el.style.display = "";
                } else {
                    el.style.display = "none";
                }
            });
        }, true);
    }

    connectedCallback() {
        this.setAttribute('tabindex', 0);
        let all = this.querySelectorAll(`[value]`);
        if (!this.value && !!all.length) {
            this.value = all[0].value;
        }
        all.forEach(el => {
            if (!!el) {
                el.onclick = clickOption.bind(this);
            }
        });
    }

    get value() {
        return this.getAttribute('value');
    }

    set value(val) {
        this.setAttribute('value', val);
    }

    get readonly() {
        let val = this.getAttribute('readonly');
        return !!val && val != "false";
    }

    set readonly(val) {
        this.setAttribute('readonly', val);
    }

    static get observedAttributes() {
        return ['value', 'readonly'];
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'value':
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById("view").value = newValue;
                    let event = new Event('change');
                    event.oldValue = oldValue;
                    event.newValue = newValue;
                    event.value = newValue;
                    this.dispatchEvent(event);
                }
                break;
            case 'readonly':
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById("view").readonly = newValue;
                }
                break;
        }
    }

}

customElements.define('ted-searchselect', SearchSelect);