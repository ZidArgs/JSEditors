import Template from "/emcJS/util/Template.js";
import "/emcJS/ui/CaptionPanel.js";
import "/emcJS/ui/CollapsePanel.js";
import "/emcJS/ui/FilteredList.js";

import "./EditorClipboard.js";
import "./EditorTrashcan.js";
import "./EditorWorkingarea.js";

import "./elements/LiteralFalse.js";
import "./elements/LiteralTrue.js";
import "./elements/LiteralNumber.js";
import "./elements/LiteralValue.js";
import "./elements/OperatorAnd.js";
import "./elements/OperatorNand.js";
import "./elements/OperatorOr.js";
import "./elements/OperatorNor.js";
import "./elements/OperatorXor.js";
import "./elements/OperatorNot.js";
import "./elements/OperatorMin.js";
import "./elements/OperatorMax.js";

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
<emc-captionpanel id="logics-panel" caption="logics">
    <emc-filteredlist id="logics"></emc-filteredlist></emc-captionpanel>
<emc-captionpanel caption="logic editor" id="workingarea-panel">
    <emc-logiceditor-workingarea id="workingarea" visualize="true"></emc-logiceditor-workingarea>
</emc-captionpanel>
<emc-captionpanel caption="clipboard" id="clipboard-panel">
    <emc-logiceditor-clipboard id="clipboard"></emc-logiceditor-clipboard>
</emc-captionpanel>
<emc-logiceditor-trashcan id="trashcan">
</emc-logiceditor-trashcan>
<emc-captionpanel caption="elements" id="elements-panel">
    <emc-filteredlist id="elements"></emc-filteredlist>
</emc-captionpanel>
`);

const WORKINGAREA = new WeakMap();
const LOGIC = new WeakMap();
const LOGIC_PATCH = new WeakMap();

function loadLogics(config, container, loadLogic) {
    for (let item of config) {
        if (item.type === "group") {
            let cnt = document.createElement("emc-collapsepanel");
            cnt.caption = item.caption;
            loadLogics(item.children, cnt, loadLogic);
            container.append(cnt);
        } else {
            let el = document.createElement("div");
            el.dataset.ref = item.access;
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
            let cnt = document.createElement("emc-collapsepanel");
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
    let caption = `${event.target.innerHTML} [${cat}]`;
    workingarea.dataset.logicType = cat;
    workingarea.dataset.logicKey = ref;
    workingarea.loadLogic(this.getLogic(ref));
    this.shadowRoot.getElementById("workingarea-panel").caption = caption;
}

class LogicEditor extends HTMLElement {

    constructor() {
        super();
        LOGIC.set(this, {});
        LOGIC_PATCH.set(this, {});
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        let workingarea = this.shadowRoot.getElementById('workingarea');
        WORKINGAREA.set(this, workingarea);
        workingarea.addEventListener('save', function(event) {
            let key = workingarea.dataset.logicKey;
            if (!!key) {
                let e = new Event('save');
                e.key = key;
                e.logic = workingarea.getLogic();
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        }.bind(this));
        workingarea.addEventListener('load', function (event) {
            let key = workingarea.dataset.logicKey;
            if (!!key) {
                workingarea.loadLogic(this.getLogic(key));
            }
            event.preventDefault();
            return false;
        }.bind(this));
        workingarea.addEventListener('clear', function(event) {
            let key = workingarea.dataset.logicKey;
            if (!!key) {
                let e = new Event('clear');
                e.key = key;
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        }.bind(this));
    }

    loadLogicList(config) {
        let container = this.shadowRoot.getElementById("logics");
        container.innerHTML = "";
        loadLogics(config, container, loadLogic.bind(this));
    }

    loadOperatorList(config) {
        let container = this.shadowRoot.getElementById("elements");
        container.innerHTML = "";
        loadOperators(config, container);
    }

    setLogic(logic) {
        let workingarea = WORKINGAREA.get(this);
        LOGIC.set(this, logic);
        let key = workingarea.dataset.logicKey;
        if (!!key) {
            workingarea.loadLogic(this.getLogic(key));
        }
    }

    setPatch(logic) {
        let workingarea = WORKINGAREA.get(this);
        LOGIC_PATCH.set(this, logic);
        let key = workingarea.dataset.logicKey;
        if (!!key) {
            workingarea.loadLogic(this.getLogic(key));
        }
    }

    getLogic(ref) {
        return LOGIC_PATCH.get(this)[ref] || LOGIC.get(this)[ref];
    }

    resetWorkingarea() {
        let workingarea = WORKINGAREA.get(this);
        workingarea.dataset.logicType = "";
        workingarea.dataset.logicKey = "";
        workingarea.loadLogic();
    }

}

customElements.define('ted-logiceditor', LogicEditor);