import Template from "/emcJS/util/Template.js";
import "/emcJS/ui/CaptionPanel.js";
import "/emcJS/ui/CollapsePanel.js";
import "/emcJS/ui/FilteredList.js";

import "./panels/Workingarea.js";

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
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 1fr;
        grid-template-areas: 
        "list workingarea";
        grid-column-gap: 5px;
        grid-row-gap: 5px;
    }
    #list-panel {
        grid-area: list;
    }
    #list-panel #data-list {
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
    .listitem {
        border: solid 1px #fff;
        background-color: #000;
        color: #fff;
        padding: 10px;
        margin: 5px;
        border-radius: 10px;
        cursor: pointer;
        overflow: hidden;
    }
    .listitem .button {
        color: #fff;
        width: 16px;
        height: 16px;
        cursor: pointer;
        overflow: hidden;
    }
</style>
<emc-captionpanel id="list-panel" caption="entries">
    <emc-filteredlist id="data-list"></emc-filteredlist>
</emc-captionpanel>
<emc-captionpanel id="workingarea-panel" caption="properties">
    <jse-properties-workingarea id="workingarea" visualize="true"></jse-properties-workingarea>
</emc-captionpanel>
`);

const WORKINGAREA = new WeakMap();
const DATA = new WeakMap();
const PATCH = new WeakMap();

function createListitem(data, onClick) {
    return el;
}

function loadList(config, container, editable) {
    for (let data of config) {
        if (data.type === "group") {
            let cnt = document.createElement("jse-collapsepanel");
            cnt.caption = data.caption;
            loadList.call(this, data.children, cnt, editable);
            container.append(cnt);
        } else {
            let el = document.createElement("div");
            el.dataset.ref = data.ref;
            el.dataset.cat = data.category;
            el.dataset.type = data.type;
            el.className = "listitem";
            el.onclick = loadData.bind(this);
            el.innerHTML = data.content;
            el.dataset.filtervalue = el.innerHTML;
            if (data.hasOwnProperty("icon")) {
                let img = document.createElement("img");
                img.src = data.icon;
                img.style.height = "16px";
                img.style.margin = "0 8px";
                img.style.verticalAlign = "bottom";
                img.style.pointerEvents = "none";
                el.append(img);
            }
            if (!!editable) {
                let edt = document.createElement("div");
                edt.onclick = editEntry.bind(this);
                edt.innerHTML = "✎";
                edt.className = "button";
                el.append(edt);
                let rmv = document.createElement("div");
                rmv.onclick = removeEntry.bind(this);
                rmv.innerHTML = "🗑";
                rmv.className = "button";
                el.append(rmv);
            }
            container.append(el);
        }
    }
    if (!!editable) {
        let el = document.createElement("div");
        el.className = "listitem";
        el.onclick = addEntry.bind(this);
        el.innerHTML = "+ Add Entry";
        container.append(el);
    }
}

async function addEntry(event) {
    // TODO
}

async function removeEntry(event) {
    // TODO
}

async function editEntry(event) {
    // TODO
}

async function loadData(event) {
    let workingarea = WORKINGAREA.get(this);
    let ref = event.target.dataset.ref;
    workingarea.dataset.key = ref;
    workingarea.loadData(this.getData(ref));
    this.shadowRoot.getElementById("workingarea-panel").caption = ref;
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
                e.data = data;
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        }.bind(this));
        workingarea.addEventListener('load', function (event) {
            let key = workingarea.dataset.key;
            if (!!key) {
                workingarea.loadData(this.getData(key));
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

    setDetailConfig(config) {
        let workingarea = WORKINGAREA.get(this);
        workingarea.setDetailConfig(config);
    }

    loadList(config, editable = false) {
        let container = this.shadowRoot.getElementById("data-list");
        container.innerHTML = "";
        loadList.call(this, config, container, !!editable);
    }

    setData(data) {
        let workingarea = WORKINGAREA.get(this);
        DATA.set(this, data);
        let key = workingarea.dataset.logicKey;
        if (!!key) {
            workingarea.loadData(this.getData(key));
        }
    }

    setPatch(patch) {
        let workingarea = WORKINGAREA.get(this);
        PATCH.set(this, patch);
        let key = workingarea.dataset.key;
        if (!!key) {
            workingarea.loadData(this.getData(key));
        }
    }

    getData(ref) {
        return PATCH.get(this)[ref] || DATA.get(this)[ref];
    }

    resetWorkingarea() {
        let workingarea = WORKINGAREA.get(this);
        workingarea.dataset.key = "";
        workingarea.loadData();
    }

}

customElements.define('jse-properties-editor', Editor);