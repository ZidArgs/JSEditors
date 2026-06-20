import HTMLTemplate from "@emcjs/fe/util/template/HTMLTemplate.js";
import "@emcjs/fe/ui/container/CaptionPanel.js";
import "@emcjs/fe/ui/container/CollapsePanel.js";
import "@emcjs/fe/ui/FilteredList.js";

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
import "../../ui/logic/ComparatorEqual.js";
import "../../ui/logic/ComparatorGreaterThanEqual.js";
import "../../ui/logic/ComparatorGreaterThan.js";
import "../../ui/logic/ComparatorLessThanEqual.js";
import "../../ui/logic/ComparatorLessThan.js";
import "../../ui/logic/ComparatorNotEqual.js";
import "../../ui/logic/MathAdd.js";
import "../../ui/logic/MathDiv.js";
import "../../ui/logic/MathMod.js";
import "../../ui/logic/MathMul.js";
import "../../ui/logic/MathPow.js";
import "../../ui/logic/MathSub.js";

const TPL = new HTMLTemplate(`
<style>
    :host {
        display: grid;
        flex: 1;
        max-width: 100%;
        max-height: 100%;
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
    <emc-filteredlist id="logics"></emc-filteredlist>
</emc-captionpanel>
<emc-captionpanel caption="logic editor" id="workingarea-panel">
    <jse-logic-workingarea id="workingarea" visualize="true"></jse-logic-workingarea>
</emc-captionpanel>
<emc-captionpanel caption="clipboard" id="clipboard-panel">
    <jse-logic-clipboard id="clipboard"></jse-logic-clipboard>
</emc-captionpanel>
<jse-logic-trashcan id="trashcan">
</jse-logic-trashcan>
<emc-captionpanel caption="elements" id="elements-panel">
    <emc-filteredlist id="elements"></emc-filteredlist>
</emc-captionpanel>
`);

const WORKINGAREA = new WeakMap();
const DATA = new WeakMap();
const PATCH = new WeakMap();

function loadList(config, container, loadLogic) {
    for (const item of config) {
        if (item.type === "group") {
            const cnt = document.createElement("emc-collapsepanel");
            cnt.caption = item.caption;
            loadList(item.children, cnt, loadLogic);
            container.append(cnt);
        } else {
            const el = document.createElement("div");
            el.dataset.ref = item.ref;
            el.dataset.cat = item.category;
            el.dataset.type = item.type;
            el.className = "logic-location";
            el.onclick = loadLogic;
            el.innerHTML = item.content;
            el.dataset.filtervalue = el.innerHTML;
            if (item["icon"] != null) {
                const img = document.createElement("img");
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
    for (const item of config) {
        if (item.type === "group") {
            const cnt = document.createElement("emc-collapsepanel");
            cnt.caption = item.caption;
            loadOperators(item.children, cnt);
            container.append(cnt);
        } else {
            const el = document.createElement(item.type);
            el.ref = item.ref;
            if (item["value"] != null) {
                el.value = item.value;
            }
            el.category = item.category;
            el.template = "true";
            el.dataset.filtervalue = el.ref;
            container.append(el);
        }
    }
}

class Editor extends HTMLElement {

    constructor() {
        super();
        DATA.set(this, {});
        PATCH.set(this, {});
        this.attachShadow({mode: "open"});
        this.shadowRoot.append(TPL.generate());
        const workingarea = this.shadowRoot.getElementById("workingarea");
        WORKINGAREA.set(this, workingarea);
        workingarea.addEventListener("save", (event) => {
            const key = workingarea.dataset.key;
            if (key) {
                const data = workingarea.getData();
                PATCH.get(this)[key] = data;
                const e = new Event("save");
                e.key = key;
                e.logic = data;
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        });
        workingarea.addEventListener("load", (event) => {
            const key = workingarea.dataset.key;
            if (key) {
                workingarea.loadData(this.getLogic(key));
            }
            event.preventDefault();
            return false;
        });
        workingarea.addEventListener("clear", (event) => {
            const key = workingarea.dataset.key;
            if (key) {
                PATCH.get(this)[key] = undefined;
                workingarea.loadData(DATA.get(this)[key]);
                const e = new Event("clear");
                e.key = key;
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        });
    }

    loadList(config) {
        const container = this.shadowRoot.getElementById("logics");
        container.innerHTML = "";
        loadList(config, container, (event) => {
            this.#loadLogic(event);
        });
    }

    loadOperators(config) {
        const container = this.shadowRoot.getElementById("elements");
        container.innerHTML = "";
        loadOperators(config, container);
    }

    setLogic(logic) {
        const workingarea = WORKINGAREA.get(this);
        DATA.set(this, logic);
        const key = workingarea.dataset.key;
        if (key) {
            workingarea.loadData(this.getLogic(key));
        }
    }

    setPatch(logic) {
        const workingarea = WORKINGAREA.get(this);
        PATCH.set(this, logic);
        const key = workingarea.dataset.key;
        if (key) {
            workingarea.loadData(this.getLogic(key));
        }
    }

    getLogic(ref) {
        return PATCH.get(this)[ref] || DATA.get(this)[ref];
    }

    reset() {
        const workingarea = WORKINGAREA.get(this);
        workingarea.dataset.type = "";
        workingarea.dataset.key = "";
        workingarea.loadData();
    }

    #loadLogic(event) {
        const workingarea = WORKINGAREA.get(this);
        const ref = event.target.dataset.ref;
        const cat = event.target.dataset.cat;
        const caption = `${ref} <${cat || "n/a"}>`;
        workingarea.dataset.type = cat;
        workingarea.dataset.key = ref;
        workingarea.loadData(this.getLogic(ref));
        this.shadowRoot.getElementById("workingarea-panel").caption = caption;
    }

}

customElements.define("jse-logic-editor", Editor);
