import Template from "../util/Template.js";
import "./ListHeader.js";

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
            min-height: 200px;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            overflow: hidden;
        }
        #scroll-container {
            flex: 1;
            overflow-x: hidden;
            overflow-y: scroll;
            background-color: var(--list-color-back, #ffffff);
            scrollbar-color: var(--list-color-hover, #b8b8b8) var(--list-color-border, #f1f1f1);
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
    <ted-listheader id="header" multimode="false">
    </ted-listheader>
    <div id="scroll-container">
        <slot id="container">
            <div id="empty">no entries</div>
        </slot>
    </div>
`);

export default class FilteredList extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        let header = this.shadowRoot.getElementById("header");
        this.shadowRoot.getElementById("container").addEventListener("slotchange", event => {
            // TODO only check new elements
            // TODO reset removed elements
            // header.search
        });
        /* header */
        header.addEventListener('filter', event => {
            let all = this.querySelectorAll(`[data-filtervalue]`);
            let panels = this.querySelectorAll(`ted-collapsepanel`);
            if (!!event.value) {
                let regEx = new RegExp(`.*${event.value.split(" ").join(".*")}.*`, "i");
                all.forEach(el => {
                    if (el.dataset.filtervalue.match(regEx)) {
                        el.style.display = "";
                    } else {
                        el.style.display = "none";
                    }
                });
                panels.forEach(el => {
                    let children = el.querySelectorAll(`[data-filtervalue]`);
                    for (let ch of children) {
                        if (ch.style.display == "") {
                            el.style.display = "";
                            return;
                        }
                    }
                    el.style.display = "none";
                });
            } else {
                all.forEach(el => {
                    el.style.display = "";
                });
                panels.forEach(el => {
                    el.style.display = "";
                });
            }
        });
    }

}

customElements.define('ted-filteredlist', FilteredList);