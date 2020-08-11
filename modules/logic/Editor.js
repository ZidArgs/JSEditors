import Template from "../../util/Template.js";
import "../../ui/CaptionPanel.js";
import "../../ui/CollapsePanel.js";
import "../../ui/FilteredList.js";

import "./panels/Clipboard.js";
import "./panels/Trashcan.js";
import "./panels/Workingarea.js";

import "../../ui/logic/LiteralFalse.js";
import "../../ui/logic/LiteralTrue.js";
import "../../ui/logic/LiteralValue.js";
import "../../ui/logic/LiteralState.js";
import "../../ui/logic/OperatorAnd.js";
import "../../ui/logic/OperatorNand.js";
import "../../ui/logic/OperatorOr.js";
import "../../ui/logic/OperatorNor.js";
import "../../ui/logic/OperatorXor.js";
import "../../ui/logic/OperatorXnor.js";
import "../../ui/logic/OperatorNot.js";
import "../../ui/logic/OperatorMin.js";
import "../../ui/logic/OperatorMax.js";
import "../../ui/logic/ReferrerAt.js";

const TPL = new Template(`
<style>
    :host {
        display: grid;
        flex: 1;
        padding: 5px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        background-color: #111;
        grid-template-columns: 2fr 2fr 1fr 1fr;
        grid-template-rows: 1fr 150px;
        grid-template-areas: 
        "logics workingarea clipboard elements"
        "logics workingarea trashcan elements";
        grid-column-gap: 5px;
        grid-row-gap: 5px;
    }
    #logics-panel {
        grid-area: logics;
    }
    #logics-panel #logics {
        border: none;
        height: 100%;
        --list-color-back: #000;
        --list-color-border: #777;
        --list-color-hover: #000;
        --list-color-front: #fff;
    }
    #workingarea-panel {
        grid-area: workingarea;
    }
    #workingarea {
        height: 100%;
    }
    #clipboard-panel {
        grid-area: clipboard;
    }
    #clipboard {
        display: contents;
    }
    #trashcan {
        grid-area: trashcan;
    }
    #elements-panel {
        grid-area: elements;
    }
    #elements {
        border: none;
        height: 100%;
        --list-color-back: #000;
        --list-color-border: #777;
        --list-color-hover: #000;
        --list-color-front: #fff;
    }
    .logic-location {
        border: solid 1px #fff;
        background-color: #000;
        color: #fff;
        padding: 10px;
        margin: 5px;
        border-radius: 10px;
        cursor: pointer;
        overflow: hidden;
    }
</style>
<ted-captionpanel id="logics-panel" caption="logics">
    <ted-filteredlist id="logics"></ted-filteredlist>
</ted-captionpanel>
<ted-captionpanel caption="logic editor" id="workingarea-panel">
    <ted-logic-workingarea id="workingarea" visualize="true"></ted-logic-workingarea>
</ted-captionpanel>
<ted-captionpanel caption="clipboard" id="clipboard-panel">
    <ted-logic-clipboard id="clipboard"></ted-logic-clipboard>
</ted-captionpanel>
<ted-logic-trashcan id="trashcan">
</ted-logic-trashcan>
<ted-captionpanel caption="elements" id="elements-panel">
    <ted-filteredlist id="elements"></ted-filteredlist>
</ted-captionpanel>
`);

const WORKINGAREA = new WeakMap();
const DATA = new WeakMap();
const PATCH = new WeakMap();

function loadList(config, container, loadLogic) {
    for (let item of config) {
        if (item.type === "group") {
            let cnt = document.createElement("ted-collapsepanel");
            cnt.caption = item.caption;
            loadList(item.children, cnt, loadLogic);
            container.append(cnt);
        } else {
            let el = document.createElement("div");
            el.dataset.ref = item.ref;
            el.dataset.cat = item.category;
            el.dataset.type = item.type;
            el.className = "logic-location";
            el.onclick = loadLogic;
            el.innerHTML = item.content;
            el.dataset.filtervalue = el.innerHTML;
            if (item.hasOwnProperty("icon")) {
                let img = document.createElement("img");
                img.src = item.icon;
                img.style.height = "16px";
                img.style.margin = "0 8px";
                img.style.verticalAlign = "bottom";
                img.style.pointerEvents = "none";
                el.append(img);
            }
            container.append(el);
        }
    }
}

function loadOperators(config, container) {
    for (let item of config) {
        if (item.type === "group") {
            let cnt = document.createElement("ted-collapsepanel");
            cnt.caption = item.caption;
            loadOperators(item.children, cnt);
            container.append(cnt);
        } else {
            let el = document.createElement(item.type);
            el.ref = item.ref;
            if (item.hasOwnProperty("value")) {
                el.value = item.value;
            }
            el.category = item.category;
            el.template = "true";
            el.dataset.filtervalue = el.ref;
            container.append(el);
        }
    }
}

async function loadLogic(event) {
    let workingarea = WORKINGAREA.get(this);
    let ref = event.target.dataset.ref;
    let cat = event.target.dataset.cat;
    let caption = `${ref} <${cat||"n/a"}>`;
    workingarea.dataset.type = cat;
    workingarea.dataset.key = ref;
    workingarea.loadData(this.getLogic(ref));
    this.shadowRoot.getElementById("workingarea-panel").caption = caption;
}

class Editor extends HTMLElement {

    constructor() {
        super();
        DATA.set(this, {});
        PATCH.set(this, {});
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        let workingarea = this.shadowRoot.getElementById('workingarea');
        WORKINGAREA.set(this, workingarea);
        workingarea.addEventListener('save', function(event) {
            let key = workingarea.dataset.key;
            if (!!key) {
                let data = workingarea.getData();
                PATCH.get(this)[key] = data;
                let e = new Event('save');
                e.key = key;
                e.logic = data;
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        }.bind(this));
        workingarea.addEventListener('load', function (event) {
            let key = workingarea.dataset.key;
            if (!!key) {
                workingarea.loadData(this.getLogic(key));
            }
            event.preventDefault();
            return false;
        }.bind(this));
        workingarea.addEventListener('clear', function(event) {
            let key = workingarea.dataset.key;
            if (!!key) {
                PATCH.get(this)[key] = undefined;
                workingarea.loadData(DATA.get(this)[key]);
                let e = new Event('clear');
                e.key = key;
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        }.bind(this));
    }

    loadList(config) {
        let container = this.shadowRoot.getElementById("logics");
        container.innerHTML = "";
        loadList(config, container, loadLogic.bind(this));
    }

    loadOperators(config) {
        let container = this.shadowRoot.getElementById("elements");
        container.innerHTML = "";
        loadOperators(config, container);
    }

    setLogic(logic) {
        let workingarea = WORKINGAREA.get(this);
        DATA.set(this, logic);
        let key = workingarea.dataset.key;
        if (!!key) {
            workingarea.loadData(this.getLogic(key));
        }
    }

    setPatch(logic) {
        let workingarea = WORKINGAREA.get(this);
        PATCH.set(this, logic);
        let key = workingarea.dataset.key;
        if (!!key) {
            workingarea.loadData(this.getLogic(key));
        }
    }

    getLogic(ref) {
        return PATCH.get(this)[ref] || DATA.get(this)[ref];
    }

    resetWorkingarea() {
        let workingarea = WORKINGAREA.get(this);
        workingarea.dataset.type = "";
        workingarea.dataset.key = "";
        workingarea.loadData();
    }

}

customElements.define('ted-logic-editor', Editor);