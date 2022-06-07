import Template from "/emcJS/util/html/Template.js";
import GlobalStyle from "/emcJS/util/html/GlobalStyle.js";
import "/emcJS/ui/layout/panel/TabPanel.js";
import "../properties/Editor.js";

const TPL = new Template(`
<div id="categories">
    <div id="button_marker" class="category" target="marker">Marker</div>
    <div id="button_areas" class="category" target="areas">Areas</div>
    <div id="button_exits" class="category" target="exits">Exits</div>
</div>
<div id="body">
    <div id="panel_marker" class="panel" category="marker">
        <emc-panel-tabpanel id="marker_tabs"></emc-panel-tabpanel>
    </div>
    <div id="panel_areas" class="panel" category="areas">
    </div>
    <div id="panel_exits" class="panel" category="exits">
    </div>
</div>
`);

const STYLE = new GlobalStyle(`
* {
    position: relative;
    box-sizing: border-box;
}
:host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
#categories {
    flex-shrink: 0;
    padding: 5px;
    overflow-x: auto;
    overflow-y: none;
    border-bottom: solid 2px #cccccc;
}
.category {
    display: inline-flex;
    margin: 0 2px;
}
.category {
    padding: 5px;
    border: solid 1px white;
    border-radius: 2px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -webkit-appearance: none;
}
.category:hover {
    background-color: gray;
}
.category.active {
    color: black;
    background-color: white;
}
#body {
    flex: 1;
    overflow: hidden;
}
.panel {
    display: none;
    height: 100%;
    width: 100%;
    overflow: auto;
    word-wrap: break-word;
    resize: none;
}
.panel.active {
    display: block;
}
`);

const MARKER_EDITORS = new WeakMap();

class Editor extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        const ctgrs = this.shadowRoot.getElementById("categories");
        ctgrs.onclick = (event) => {
            const targetEl = event.target.getAttribute("target");
            if (targetEl) {
                this.active = targetEl;
                event.preventDefault();
                return false;
            }
        }
        /* --- */
        MARKER_EDITORS.set(this, new Map());
    }

    connectedCallback() {
        if (!this.active) {
            const el = this.shadowRoot.querySelector("[target]");
            if (el != null) {
                this.active = el.getAttribute("target");
            }
        }
    }

    get active() {
        return this.getAttribute("active");
    }

    set active(val) {
        this.setAttribute("active", val);
    }

    static get observedAttributes() {
        return ["active"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue) {
            if (oldValue) {
                const ol = this.shadowRoot.getElementById(`panel_${oldValue}`);
                if (ol != null) {
                    ol.classList.remove("active");
                }
                const ob = this.shadowRoot.querySelector(`[target="${oldValue}"]`);
                if (ob != null) {
                    ob.classList.remove("active");
                }
            }
            const nl = this.shadowRoot.getElementById(`panel_${newValue}`);
            if (nl != null) {
                nl.classList.add("active");
            }
            const nb = this.shadowRoot.querySelector(`[target="${newValue}"]`);
            if (nb != null) {
                nb.classList.add("active");
            }
        }
    }

    setDetailConfig(config) {
        // marker
        const markerEditors = MARKER_EDITORS.get(this);
        for (const [category, markerEditor] of markerEditors) {
            const entry = config.marker?.[category];
            if (entry != null) {
                markerEditor.setDetailConfig(entry);
            }
        }
    }

    addMarkerCategory(name, config) {
        const editors = MARKER_EDITORS.get(this);
        // ---
        const tabEl = this.shadowRoot.getElementById("marker_tabs");
        const cntEl = tabEl.addTab(name);
        const editorEl = document.createElement("jse-properties-editor");
        editorEl.setDetailConfig(config);
        // events
        editorEl.addEventListener("save", async (event) => {
            const e = new Event("savemarker");
            e.category = name;
            e.key = event.key;
            e.data = event.data;
            this.dispatchEvent(e);
        });
        editorEl.addEventListener("clear", async (event) => {
            const e = new Event("clearmarker");
            e.category = name;
            e.key = event.key;
            e.data = event.data;
            this.dispatchEvent(e);
        });
        // ---
        cntEl.append(editorEl);
        editors.set(name, editorEl);
    }

    loadList(config) {
        // marker
        const markerEditors = MARKER_EDITORS.get(this);
        for (const [category, markerEditor] of markerEditors) {
            const entry = config.marker?.[category];
            if (entry != null) {
                markerEditor.loadList(entry);
            }
        }
    }

    setData(data) {
        // marker
        const markerEditors = MARKER_EDITORS.get(this);
        for (const [category, markerEditor] of markerEditors) {
            const entry = data.marker?.[category];
            if (entry != null) {
                markerEditor.setData(entry);
            }
        }
    }

    setPatch(patch) {
        // marker
        const markerEditors = MARKER_EDITORS.get(this);
        for (const [category, markerEditor] of markerEditors) {
            const entry = patch.marker?.[category];
            if (entry != null) {
                markerEditor.setPatch(entry);
            }
        }
    }

    reset() {
        // marker
        const markerEditors = MARKER_EDITORS.get(this);
        for (const [, markerEditor] of markerEditors) {
            markerEditor.reset();
        }
    }

}

customElements.define("jse-world-editor", Editor);
