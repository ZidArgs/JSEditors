import Template from "/emcJS/util/Template.js";

import "/emcJS/ui/CaptionPanel.js";
import "/emcJS/ui/CollapsePanel.js";
import "/emcJS/ui/FilteredList.js";
import "../properties/panels/Workingarea.js";

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
<emc-captionpanel id="list-panel" caption="entries">
    <emc-filteredlist>
        <emc-collapsepanel caption="areas"></emc-collapsepanel>
        <emc-collapsepanel caption="exits"></emc-collapsepanel>
        <emc-collapsepanel caption="locations"></emc-collapsepanel>
    </emc-filteredlist>
</emc-captionpanel>
<emc-captionpanel id="workingarea-panel" caption="properties">
    <div id="button-container" class="hidden">
        <span id="save" class="button">save</span>
        <span id="load" class="button">load</span>
        <span id="clear" class="button">reset</span>
    </div>
    <jse-properties-workingarea id="area-details" class="hidden" visualize="true"></jse-properties-workingarea>
    <jse-properties-workingarea id="exit-details" class="hidden" visualize="true"></jse-properties-workingarea>
    <jse-properties-workingarea id="location-details" class="hidden" visualize="true"></jse-properties-workingarea>
</emc-captionpanel>
`);

export default class MarkerEdit extends HTMLElement {

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

customElements.define('jse-world-markeredit', MarkerEdit);