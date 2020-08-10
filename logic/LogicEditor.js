import Template from "../util/Template.js";
import "../ui/CaptionPanel.js";
import "../ui/CollapsePanel.js";
import "../ui/FilteredList.js";

import "./EditorClipboard.js";
import "./EditorTrashcan.js";
import "./EditorWorkingarea.js";

import "./elements/LiteralFalse.js";
import "./elements/LiteralTrue.js";
import "./elements/LiteralValue.js";
import "./elements/LiteralState.js";
import "./elements/OperatorAnd.js";
import "./elements/OperatorNand.js";
import "./elements/OperatorOr.js";
import "./elements/OperatorNor.js";
import "./elements/OperatorXor.js";
import "./elements/OperatorXnor.js";
import "./elements/OperatorNot.js";
import "./elements/OperatorMin.js";
import "./elements/OperatorMax.js";
import "./elements/ReferrerAt.js";

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
    <ted-filteredlist id="logics"></ted-filteredlist></ted-captionpanel>
<ted-captionpanel caption="logic editor" id="workingarea-panel">
    <ted-logiceditor-workingarea id="workingarea" visualize="true"></ted-logiceditor-workingarea>
</ted-captionpanel>
<ted-captionpanel caption="clipboard" id="clipboard-panel">
    <ted-logiceditor-clipboard id="clipboard"></ted-logiceditor-clipboard>
</ted-captionpanel>
<ted-logiceditor-trashcan id="trashcan">
</ted-logiceditor-trashcan>
<ted-captionpanel caption="elements" id="elements-panel">
    <ted-filteredlist id="elements"></ted-filteredlist>
</ted-captionpanel>
`);

const WORKINGAREA = new WeakMap();
const LOGIC = new WeakMap();
const LOGIC_PATCH = new WeakMap();

function loadLogics(config, container, loadLogic) {
    for (let item of config) {
        if (item.type === "group") {
            let cnt = document.createElement("ted-collapsepanel");
            cnt.caption = item.caption;
            loadLogics(item.children, cnt, loadLogic);
            container.append(cnt);
        } else {
            let el = document.createElement("div");
            if (!!item.access) {
                el.dataset.ref = item.access;
            } else if (!!item.edge) {
                el.dataset.ref = item.edge[0];
                el.dataset.target = item.edge[1];
            }
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
    let cat = event.target.dataset.cat;
    let caption = `${event.target.innerHTML} [${cat}]`;
    workingarea.dataset.logicType = cat;

    if (!!event.target.dataset.ref) {
        let ref = event.target.dataset.ref;
        workingarea.dataset.logicKey = ref;
        let target = event.target.dataset.target;
        workingarea.dataset.targetKey = target || "";
        workingarea.loadLogic(this.getLogic(ref, target));
        if (!!target) {
            caption = `${ref} -> ${target} [${cat}]`;
        }
    }

    this.shadowRoot.getElementById("workingarea-panel").caption = caption;
}

class LogicEditor extends HTMLElement {

    constructor() {
        super();
        LOGIC.set(this, {});
        LOGIC_PATCH.set(this, {
            edges: {},
            logic: {}
        });
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        let workingarea = this.shadowRoot.getElementById('workingarea');
        WORKINGAREA.set(this, workingarea);
        workingarea.addEventListener('save', function(event) {
            let logicPatch = LOGIC_PATCH.get(this);
            let key = workingarea.dataset.logicKey;
            if (!!key) {
                let target = workingarea.dataset.targetKey;
                if (!!target) {
                    if (logicPatch.edges[key] == null) {
                        logicPatch.edges[key] = {};
                    }
                    logicPatch.edges[key][target] = workingarea.getLogic();
                } else {
                    logicPatch.logic[key] = workingarea.getLogic();
                }
                let e = new Event('save');
                e.key = key;
                if (!!target) {
                    e.targetKey = target;
                }
                e.logic = workingarea.getLogic();
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        }.bind(this));
        workingarea.addEventListener('load', function (event) {
            let key = workingarea.dataset.logicKey;
            if (!!key) {
                let target = workingarea.dataset.targetKey;
                workingarea.loadLogic(this.getLogic(key, target));
            }
            event.preventDefault();
            return false;
        }.bind(this));
        workingarea.addEventListener('clear', function(event) {
            let logicPatch = LOGIC_PATCH.get(this);
            let key = workingarea.dataset.logicKey;
            if (!!key) {
                let target = workingarea.dataset.targetKey;
                if (!!target) {
                    if (logicPatch.edges[key] != null) {
                        logicPatch.edges[key][target] = undefined;
                    }
                } else {
                    logicPatch.logic[key] = undefined;
                }
                workingarea.loadLogic(this.getLogic(key, target));
                let e = new Event('clear');
                e.key = key;
                if (!!target) {
                    e.targetKey = target;
                }
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
            let target = workingarea.dataset.targetKey;
            workingarea.loadLogic(this.getLogic(key, target));
        }
    }

    setPatch(logic) {
        let workingarea = WORKINGAREA.get(this);
        LOGIC_PATCH.set(this, logic);
        let key = workingarea.dataset.logicKey;
        if (!!key) {
            let target = workingarea.dataset.targetKey;
            workingarea.loadLogic(this.getLogic(key, target));
        }
    }

    getLogic(ref, target) {
        let logic = LOGIC.get(this);
        let logicPatch = LOGIC_PATCH.get(this);
        if (!!target) {
            if (logicPatch.edges != null && logicPatch.edges[ref] != null && logicPatch.edges[ref][target] != null) {
                return logicPatch.edges[ref][target];
            } else if (logic.edges != null && logic.edges[ref] != null && logic.edges[ref][target] != null) {
                return logic.edges[ref][target];
            }
            return {};
        }
        if (logicPatch.logic != null && logicPatch.logic[ref] != null) {
            return logicPatch.logic[ref];
        } else if (logic.logic != null && logic.logic[ref] != null) {
            return logic.logic[ref];
        }
        return {};
    }

    resetWorkingarea() {
        let workingarea = WORKINGAREA.get(this);
        workingarea.dataset.logicType = "";
        workingarea.dataset.logicKey = "";
        workingarea.dataset.targetKey = "";
        workingarea.loadLogic();
    }

}

customElements.define('ted-logiceditor', LogicEditor);