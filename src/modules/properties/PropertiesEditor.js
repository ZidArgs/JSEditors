import CustomElement from "/emcJS/ui/element/CustomElement.js";
import "/emcJS/ui/container/CaptionPanel.js";
import "/emcJS/ui/container/CollapsePanel.js";
import "/emcJS/ui/FilteredList.js";
import "./panels/Workingarea.js";
import TPL from "./PropertiesEditor.js.html" assert {type: "html"};
import STYLE from "./PropertiesEditor.js.css" assert {type: "css"};

const WORKINGAREA = new WeakMap();
const DATA = new WeakMap();
const PATCH = new WeakMap();

// TODO
class Editor extends CustomElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        DATA.set(this, {});
        PATCH.set(this, {});
        const workingarea = this.shadowRoot.getElementById("workingarea");
        WORKINGAREA.set(this, workingarea);
        workingarea.addEventListener("save", (event) => {
            const key = workingarea.dataset.key;
            if (key) {
                const data = workingarea.getData();
                PATCH.get(this)[key] = data;
                const e = new Event("save");
                e.key = key;
                e.data = data;
                this.dispatchEvent(e);
            }
            event.preventDefault();
            return false;
        });
        workingarea.addEventListener("load", (event) => {
            const key = workingarea.dataset.key;
            if (key) {
                workingarea.loadData(this.getData(key));
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

    setData(data) {
        const workingarea = WORKINGAREA.get(this);
        DATA.set(this, data);
        const key = workingarea.dataset.logicKey;
        if (key) {
            workingarea.loadData(this.getData(key));
        }
    }

    getData(ref) {
        return PATCH.get(this)[ref] || DATA.get(this)[ref];
    }

    reset() {
        const workingarea = WORKINGAREA.get(this);
        workingarea.dataset.key = "";
        workingarea.loadData();
    }

}

customElements.define("jse-properties-editor", Editor);
