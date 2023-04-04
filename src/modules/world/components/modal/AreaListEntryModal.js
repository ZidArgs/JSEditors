import ElementManager from "/emcJS/util/html/ElementManager.js";
import i18n from "/emcJS/util/I18n.js";
import {
    sortChildren
} from "/emcJS/util/helper/ui/NodeListSort.js";
import EventTargetManager from "/emcJS/util/event/EventTargetManager.js";
import Modal from "/emcJS/ui/modal/Modal.js";
import I18nOption from "/emcJS/ui/i18n/builtin/I18nOption.js";
import "/emcJS/ui/FilteredList.js";
import "/emcJS/ui/container/CollapsePanel.js";
import "/emcJS/ui/form/button/Button.js";
import {
    areaListEntries, exitListEntries, locationListEntries
} from "../../data/EntityRegistries.js";
import TPL from "./AreaListEntryModal.js.html" assert {type: "html"};
import STYLE from "./AreaListEntryModal.js.css" assert {type: "css"};

function entryComposer(key, params) {
    const {type, ref = key} = params;
    const el = I18nOption.create();
    el.i18nValue = ref;
    el.value = ref;
    el.dataset.type = type;
    return el;
}

export default class AreaListEntryModal extends Modal {

    #locationCollapsibleEl;

    #exitCollapsibleEl;

    #areaCollapsibleEl;

    #locationEntryElManager;

    #exitEntryElManager;

    #areaEntryElManager;

    #i18nEventManager = new EventTargetManager(i18n);

    constructor() {
        super("Choose Entry...");
        const els = TPL.generate();
        STYLE.apply(this.shadowRoot);
        /* --- */
        const footerEl = this.shadowRoot.getElementById("footer");
        const contentEl = this.shadowRoot.getElementById("content");
        contentEl.innerHTML = "";
        const containerEl = els.getElementById("elements");
        contentEl.append(containerEl);
        /* --- */
        const cancelEl = els.getElementById("cancel");
        cancelEl.addEventListener("click", () => {
            this.close();
        });
        footerEl.append(cancelEl);
        /* --- */
        containerEl.addEventListener("click", (event) => {
            const targetEl = event.target;
            if (targetEl instanceof I18nOption) {
                this.remove();
                const ev = new Event("submit");
                ev.ref = targetEl.value;
                ev.type = targetEl.dataset.type;
                this.dispatchEvent(ev);
                event.preventDefault();
                return false;
            }
        });
        /* --- */
        this.#locationCollapsibleEl = this.shadowRoot.getElementById("locations");
        this.#exitCollapsibleEl = this.shadowRoot.getElementById("exits");
        this.#areaCollapsibleEl = this.shadowRoot.getElementById("areas");
        this.#locationEntryElManager = new ElementManager(this.#locationCollapsibleEl, {
            composer: entryComposer
        });
        this.#exitEntryElManager = new ElementManager(this.#exitCollapsibleEl, {
            composer: entryComposer
        });
        this.#areaEntryElManager = new ElementManager(this.#areaCollapsibleEl, {
            composer: entryComposer
        });
        /* --- */
        locationListEntries.addEventListener("change", () => {
            this.#refreshLocationEntries();
        });
        exitListEntries.addEventListener("change", () => {
            this.#refreshExitEntries();
        });
        areaListEntries.addEventListener("change", () => {
            this.#refreshAreaEntries();
        });
        /* --- */
        this.#i18nEventManager.set("language", () => {
            sortChildren(this.#locationCollapsibleEl);
            sortChildren(this.#exitCollapsibleEl);
            sortChildren(this.#areaCollapsibleEl);
        });
        this.#i18nEventManager.set("translation", () => {
            sortChildren(this.#locationCollapsibleEl);
            sortChildren(this.#exitCollapsibleEl);
            sortChildren(this.#areaCollapsibleEl);
        });
        /* --- */
        this.#refreshLocationEntries();
        this.#refreshExitEntries();
        this.#refreshAreaEntries();
    }

    #refreshLocationEntries() {
        this.#locationCollapsibleEl.innerHTML = "";
        const data = [];
        for (const location of locationListEntries) {
            data.push({key: location, type: "location"});
        }
        this.#locationEntryElManager.manage(data);
        sortChildren(this.#locationCollapsibleEl);
    }

    #refreshExitEntries() {
        this.#exitCollapsibleEl.innerHTML = "";
        const data = [];
        for (const location of exitListEntries) {
            data.push({key: location, type: "exit"});
        }
        this.#exitEntryElManager.manage(data);
        sortChildren(this.#exitCollapsibleEl);
    }

    #refreshAreaEntries() {
        this.#areaCollapsibleEl.innerHTML = "";
        const data = [];
        for (const location of areaListEntries) {
            data.push({key: location, type: "area"});
        }
        this.#areaEntryElManager.manage(data);
        sortChildren(this.#areaCollapsibleEl);
    }

}

customElements.define("jse-world-editor-modal-area-list-entry", AreaListEntryModal);
