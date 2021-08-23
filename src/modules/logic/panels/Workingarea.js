import DragDropMemory from "/emcJS/util/DragDropMemory.js";
import Template from "/emcJS/util/html/Template.js";

import LogicAbstractElement from "../../../ui/logic/AbstractElement.js";

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
        slot {
            display: block;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
        }
    </style>
    <div id="button-container">
        <span id="save" class="button">save</span>
        <span id="load" class="button">load</span>
        <span id="clear" class="button">reset</span>
    </div>
    <slot id="child">
        <span id="droptarget" class="placeholder">...</span>
    </slot>
`);

function allowDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

function dropOnPlaceholder(event) {
    const els = DragDropMemory.get();
    if (els.length) {
        const el = els[0];
        if (el) {
            const ne = event.target.getRootNode().host.append(el.getElement(event.ctrlKey));
            if (ne) {
                ne.removeAttribute("slot");
            }
        }
    }
    event.preventDefault();
    event.stopPropagation();
    return false;
}

export default class Workingarea extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        const target = this.shadowRoot.getElementById('droptarget');
        target.ondragover = allowDrop;
        target.ondrop = dropOnPlaceholder.bind(this);
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

    getData() {
        const el = this.children[0];
        if (el) {
            return el.toJSON();
        }
    }

    loadData(data) {
        if (this.children.length) this.removeChild(this.children[0]);
        if (data) {
            this.append(LogicAbstractElement.buildLogic(data));
        }
    }
    
    append(el) {
        if (el instanceof LogicAbstractElement && (typeof this.template != "string" || this.template == "false")) {
            return super.append(el);
        }
    }

}

customElements.define('jse-logic-workingarea', Workingarea);
