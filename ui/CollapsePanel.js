import Template from "../util/Template.js";

const TPL = new Template(`
    <style>
        * {
            box-sizing: border-box;
        }
        :host {
            position: relative;
            display: flex;
            flex-direction: column;
            margin: 5px;
            border: solid 2px #777;
            overflow: hidden;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }
        #title {
            display: flex;
            top: 0;
            padding: 8px;
            background-color: #777;
            color: #fff;
        }
        #title:before {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            font-weight: bold;
            text-align: center;
            content: "+"
        }
        :host([expanded]:not([expanded="false"])) #title:before {
            content:"-"
        }
        #body {
            position: relative;
            display: none;
            overflow-x: hidden;
            overflow-y: auto;
        }
        :host([expanded]:not([expanded="false"])) #body {
            display: block;
        }
    </style>
    <div id="title"></div>
    <slot id="body"></slot>
`);

export default class CollapsePanel extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        this.shadowRoot.getElementById('title').addEventListener("click", function(event) {
            if (!!this.expanded && this.expanded != "false") {
                this.expanded = "false";
            } else {
                this.expanded = "true";
            }
        }.bind(this));
    }

    get expanded() {
        return this.getAttribute('expanded');
    }

    set expanded(val) {
        this.setAttribute('expanded', val);
    }

    get caption() {
        return this.getAttribute('caption');
    }

    set caption(val) {
        this.setAttribute('caption', val);
    }

    static get observedAttributes() {
        return ['caption'];
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'caption':
                if (oldValue != newValue) {
                    this.shadowRoot.getElementById('title').innerHTML = newValue;
                }
                break;
        }
    }

}

customElements.define('ted-collapsepanel', CollapsePanel);