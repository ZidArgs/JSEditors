import DragDropMemory from "@emcjs/fe/data/DragDropMemory.js";
import HTMLTemplate from "@emcjs/fe/util/template/HTMLTemplate.js";

import LogicAbstractElement from "../../../ui/logic/AbstractElement.js";

const TPL = new HTMLTemplate(`
    <style>
        * {
            position: relative;
            box-sizing: border-box;
        }
        :host {
            display: flex;
            padding: 5px;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            border: solid 2px;
            background-color: #222;
            border-color: #777;
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
        #container {
            display: block;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
        }
    </style>
    <div id="container">
        <slot id="children"></slot>
        <span id="droptarget" class="placeholder">...</span>
    </div>
`);

export default class Clipboard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.append(TPL.generate());
        const target = this.shadowRoot.getElementById("droptarget");
        target.ondragover = (event) => {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        target.ondrop = (event) => {
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
        };
    }

    getLogic() {
        const el = this.children[0];
        if (el) {
            return el.toJSON();
        }
    }

    append(el) {
        if (el instanceof LogicAbstractElement && (typeof this.template != "string" || this.template == "false")) {
            return super.append(el);
        }
    }

}

customElements.define("jse-logic-clipboard", Clipboard);
