import Template from "../util/Template.js";

const TPL = new Template(`
    <style>
        :host {
            display: flex;
            padding: 2px 0;
            background: var(--list-color-border, #f1f1f1);
        }
        #filter-wrapper {
            display: flex;
            flex: 1;
            background: var(--list-color-back, #ffffff);
        }
        #filter-reset {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 25px;
            height: 25px;
            color: var(--list-color-front, #000000);
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
        }
        #filter {
            flex: 1;
            height: 28px;
            padding: 0 4px;
            color: var(--list-color-front, #000000);
            background: var(--list-color-back, #ffffff);
            border: none;
            -webkit-appearance: none;
            outline: none;
        }
        #selection {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 7px;
            cursor: pointer;
            -webkit-appearance: none;
            outline: none;
        }
        #selection::before {
            font-size: 18px;
            content: "\u2610";
        }
        #selection:indeterminate::before {
            content: "\u2612";
        }
        #selection:checked::before {
            content: "\u2611";
        }
    </style>
    <input type="checkbox" id="selection">
    <div id="filter-wrapper">
        <input id="filter" placeholder="filter">
        <div id="filter-reset">⨯</div>
    </div>
`);

export default class ListHeader extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());

        this.shadowRoot.getElementById("selection").addEventListener("change", ev => {
            this.checked = ev.target.checked;
            let event = new Event('check');
            event.value = ev.target.checked;
            this.dispatchEvent(event);
        });

        this.shadowRoot.getElementById("filter").addEventListener("change", ev => {
            this.search = ev.target.value;
            let event = new Event('filter');
            event.value = ev.target.value;
            this.dispatchEvent(event);
        });

        this.shadowRoot.getElementById("filter-reset").addEventListener("click", ev => {
            this.search = "";
            let event = new Event('filter');
            event.value = "";
            this.dispatchEvent(event);
        });
    }

    connectedCallback() {
        let selection = this.shadowRoot.getElementById("selection");
        if (!this.multimode) {
            selection.style.display = "none";
        } else {
            selection.style.display = "";
        }
    }

    get checked() {
        return this.getAttribute('checked');
    }

    set checked(val) {
        this.setAttribute('checked', val);
    }

    get search() {
        return this.getAttribute('search');
    }

    set search(val) {
        this.setAttribute('search', val);
    }

    get multimode() {
        return this.getAttribute('multimode') == "true";
    }

    set multimode(val) {
        this.setAttribute('multimode', val);
    }

    static get observedAttributes() {
        return ['checked', 'search', 'multimode'];
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'checked':
                if (oldValue != newValue) {
                    let selection = this.shadowRoot.getElementById("selection");
                    if (newValue == "mixed") {
                        selection.checked = true;
                        selection.indeterminate = true;
                    } else {
                        selection.checked = newValue != "false";
                        selection.indeterminate = false;
                    }
                }
                break;
            case 'search':
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById("filter").value = newValue;
                }
                break;
            case 'multimode':
                if (oldValue != newValue) {
                    let selection = this.shadowRoot.getElementById("selection");
                    if (newValue != "true") {
                        selection.style.display = "none";
                    } else {
                        selection.style.display = "";
                    }
                }
                break;
        }
    }

}

customElements.define('ted-listheader', ListHeader);