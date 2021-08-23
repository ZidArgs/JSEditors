import Template from "/emcJS/util/html/Template.js";

import "/emcJS/ui/input/ListSelect.js";
import "/emcJS/ui/input/SearchSelect.js";
import "../../../ui/SimpleLogicEdit.js";

const TPL = new Template(`
    <style>
        * {
            position: relative;
            box-sizing: border-box;
        }
        :host {
            display: flex;
            flex-direction: column;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            overflow: hidden;
        }
        .placeholder {
            display: table;
            margin: 5px;
            padding: 5px 20px;
            color: black;
            background-color: lightgray;
            border: 1px solid gray;
            font-weight: bold;
        }
        #button-container {
            display: flex;
            align-items: center;
            top: 0;
            padding: 6px 0;
            background-color: #777;
            color: #fff;
        }
        .button {
            padding: 2px;
            margin: 0 4px;
            background: white;
            color: black;
            cursor: pointer;
        }
        .button:hover {
            background: black;
            color: white;
        }
        #details {
            display: block;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
        }
        label {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin: 10px 5px;
            padding: 5px;
        }
        label:hover {
            background-color: rgba(255,255,255,0.1);
        }
        label span {
            display: inline-block;
            flex: 1;
            min-width: 300px;
            max-width: 500px;
            height: 18px;
            margin-bottom: 5px;
        }
        input[type="text"],
        input[type="number"],
        select {
            flex-grow: 0;
            flex-shrink: 0;
            height: 30px;
            padding: 0px 5px;
            font-size: inherit;
        }
    </style>
    <div id="button-container">
        <span id="save" class="button">save</span>
        <span id="load" class="button">load</span>
        <span id="clear" class="button">reset</span>
    </div>
    <div id="details"></div>
`);

function generateField(label) {
    const el = document.createElement("label");
    el.className = "settings-option";
    const text = document.createElement("span");
    text.innerHTML = label;
    text.className = "option-text";
    el.append(text);
    return el;
}

export default class Workingarea extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        this.shadowRoot.getElementById('save').addEventListener('click', function(event) {
            this.dispatchEvent(new Event('save'));
        }.bind(this));
        this.shadowRoot.getElementById('load').addEventListener('click', function(event) {
            this.dispatchEvent(new Event('load'));
        }.bind(this));
        this.shadowRoot.getElementById('clear').addEventListener('click', function(event) {
            this.dispatchEvent(new Event('clear'));
        }.bind(this));
    }

    setDetailConfig(config) {
        const cnt = this.shadowRoot.getElementById("details");
        cnt.innerHTML = "";
        for (const i in config) {
            const val = config[i];
            const label = val.title || i;
            const min = parseFloat(val.min);
            const max = parseFloat(val.max);
            switch (val.type) {
                case "string":
                    cnt.append(createStringInput(label, i));
                    break;
                case "number":
                    cnt.append(createNumberInput(label, i, min, max));
                    break;
                case "range":
                    cnt.append(createRangeInput(label, i, min, max));
                    break;
                case "check":
                    cnt.append(createCheckInput(label, i));
                    break;
                case "choice":
                    cnt.append(createChoiceInput(label, i, val.values));
                    break;
                case "list":
                    cnt.append(createListSelectInput(label, i, val.values));
                    break;
                case "select":
                    cnt.append(createSearchSelectInput(label, i, val.values));
                    break;
                case "logic":
                    cnt.append(createSimpleLogicEditor(label, i, val.operators));
                    break;
            }
        }
    }

    getData() {
        const cnt = this.shadowRoot.getElementById("details");
        const els = Array.from(cnt.querySelectorAll("[data-ref]"));
        const res = {};
        for (const el of els) {
            const ref = el.dataset.ref;
            if (el.getAttribute("type") === "checkbox") {
                res[ref] = !!el.checked;
            } else if (el.getAttribute("type") === "logic") {
                res[ref] = el.getLogic();
            } else if (el.getAttribute("type") === "list") {
                res[ref] = el.serialize();
            } else {
                res[ref] = el.value;
            }
        }
        return res;
    }

    loadData(data) {
        if (data) {
            const cnt = this.shadowRoot.getElementById("details");
            const els = Array.from(cnt.querySelectorAll("[data-ref]"));
            for (const el of els) {
                const ref = el.dataset.ref;
                if (el.getAttribute("type") === "checkbox") {
                    el.checked = !!data[ref];
                } else if (el.getAttribute("type") === "logic") {
                    el.setLogic(data[ref]);
                } else if (el.getAttribute("type") === "list") {
                    el.deserialize(data[ref]);
                } else {
                    el.value = data[ref];
                }
            }
        }
    }

}

customElements.define('jse-properties-workingarea', Workingarea);

function createStringInput(label, ref) {
    const el = generateField(label);
    const input = document.createElement("input");
    input.className = "settings-input";
    input.setAttribute("type", "text");
    input.dataset.ref = ref;
    el.append(input);
    return el;
}

function createNumberInput(label, ref, min, max) {
    const el = generateField(label);
    const input = document.createElement("input");
    input.className = "settings-input";
    input.setAttribute("type", "number");
    if (!isNaN(min)) {
        input.setAttribute("min", min);
    }
    if (!isNaN(max)) {
        input.setAttribute("max", max);
    }
    input.dataset.ref = ref;
    el.append(input);
    return el;
}

function createRangeInput(label, ref, min, max) {
    const el = generateField(label);
    const input = document.createElement("input");
    input.className = "settings-input";
    input.setAttribute("type", "range");
    if (!isNaN(min)) {
        input.setAttribute("min", min);
    }
    if (!isNaN(max)) {
        input.setAttribute("max", max);
    }
    input.dataset.ref = ref;
    el.append(input);
    return el;
}

function createCheckInput(label, ref) {
    const el = generateField(label);
    const input = document.createElement("input");
    input.className = "settings-input";
    input.setAttribute("type", "checkbox");
    input.dataset.ref = ref;
    el.append(input);
    return el;
}

function createChoiceInput(label, ref, values) {
    const el = generateField(label);
    const input = document.createElement("select");
    input.className = "settings-input";
    input.setAttribute("type", "input");
    for (const value of values) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = value;
        input.append(opt);
    }
    input.dataset.ref = ref;
    el.append(input);
    return el;
}

function createListSelectInput(label, ref, values) {
    const el = generateField(label);
    const input = document.createElement("emc-listselect");
    input.className = "settings-input";
    input.setAttribute("type", "list");
    input.multiple = true;
    input.dataset.ref = ref;
    for (const value of values) {
        const opt = document.createElement('emc-option');
        opt.value = value;
        opt.innerHTML = value;
        input.append(opt);
    }
    el.append(input);
    return el;
}

function createSearchSelectInput(label, ref, values) {
    const el = generateField(label);
    const input = document.createElement("emc-searchselect");
    input.className = "settings-input";
    input.setAttribute("type", "select");
    input.dataset.ref = ref;
    for (const value of values) {
        const opt = document.createElement('emc-option');
        opt.value = value;
        opt.innerHTML = value;
        input.append(opt);
    }
    el.append(input);
    return el;
}

function createSimpleLogicEditor(label, ref, operators) {
    const el = generateField(label);
    const input = document.createElement("jse-simplelogiceditor");
    input.className = "settings-input";
    input.setAttribute("type", "logic");
    input.dataset.ref = ref;
    input.setOperators(operators);
    el.append(input);
    return el;
}
