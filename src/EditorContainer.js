import CustomElement from "@emcjs/fe/ui/element/CustomElement.js";
import "@emcjs/fe/ui/Page.js";
import "@emcjs/fe/ui/navigation/NavBar.js";
import "./EditorChoice.js";
import TPL from "./EditorContainer.js.html" assert {type: "html"};
import STYLE from "./EditorContainer.js.css" assert {type: "css"};

export default class EditorContainer extends CustomElement {

    #choiceEl = null;

    #panelConfig = new Map();

    #currentPanel = null;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#choiceEl = this.shadowRoot.getElementById("choice");
        this.#choiceEl.addEventListener("choice", (event) => {
            this.changeApp(event.app);
        });
    }

    register({
        name, panelEl, refreshFn
    } = {}) {
        if (typeof name !== "string" || name == "") {
            throw Error("panel name must be a non empty string");
        }
        if (this.#panelConfig.has(name)) {
            throw Error(`panel with name "${name}" already registered`);
        }
        this.#panelConfig.set(name, {
            panelEl,
            refreshFn
        });
        panelEl.addEventListener("close", () => this.changeApp());
        this.#choiceEl.register(name);
        this.append(panelEl);
    }

    closeCurrent() {
        this.changeApp();
    }

    async changeApp(name) {
        if (typeof name !== "string" || name == "") {
            if (this.#currentPanel != null) {
                this.#currentPanel.removeAttribute("slot");
            }
            this.#currentPanel = null;

            const ev = new Event("change");
            ev.data = "";
            this.dispatchEvent(ev);
        } else {
            const {
                panelEl, refreshFn
            } = this.#panelConfig.get(name);
            if (panelEl == null) {
                await this.changeApp();
            } else {
                if (this.#currentPanel != null) {
                    this.#currentPanel.removeAttribute("slot");
                }
                panelEl.setAttribute("slot", "visible");
                this.#currentPanel = panelEl;
                if (typeof refreshFn === "function") {
                    await refreshFn();
                }

                const ev = new Event("change");
                ev.data = name;
                this.dispatchEvent(ev);
            }
        }
    }

}

customElements.define("jse-editor-container", EditorContainer);
