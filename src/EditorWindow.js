import CustomElement from "/emcJS/ui/element/CustomElement.js";
import "/emcJS/ui/Page.js";
import "/emcJS/ui/navigation/NavBar.js";
import "./EditorChoice.js";
import TPL from "./EditorWindow.js.html" assert {type: "html"};
import STYLE from "./EditorWindow.js.css" assert {type: "css"};

const TITLE_PREFIX = "Editor";

export default class EditorWindow extends CustomElement {

    #navbarEl = null;

    #choiceEl = null;

    #panelConfig = new Map();

    #currentPanel = null;

    #mainNav = [{
        "content": "EXIT",
        "handler": () => {
            this.close();
        }
    }];

    #defaultNav = [{
        "content": "EXIT",
        "handler": () => {
            this.changeApp();
        }
    }];

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#navbarEl = this.shadowRoot.getElementById("navbar");
        this.#navbarEl.loadNavigation(this.buildNav(this.#mainNav));
        /* --- */
        this.#choiceEl = this.shadowRoot.getElementById("choice");
        this.#choiceEl.addEventListener("choice", (event) => {
            this.changeApp(event.app);
        });
    }

    register({name, panelEl, navConfig, refreshFn} = {}) {
        if (typeof name !== "string" || name == "") {
            throw Error("Panel name must be a non empty string");
        }
        if (this.#panelConfig.has(name)) {
            throw Error(`Panel with name "${name}" already registered`);
        }
        this.#panelConfig.set(name, {
            panelEl,
            navConfig,
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
            document.title = TITLE_PREFIX;
            if (this.#currentPanel != null) {
                this.#currentPanel.removeAttribute("slot");
            }
            this.#currentPanel = null;
            this.#navbarEl.loadNavigation(this.buildNav(this.#mainNav));
        } else {
            const {panelEl, refreshFn, navConfig} = this.#panelConfig.get(name);
            if (panelEl == null) {
                await this.changeApp();
            } else {
                document.title = `${TITLE_PREFIX} - ${name}`;
                if (this.#currentPanel != null) {
                    this.#currentPanel.removeAttribute("slot");
                }
                panelEl.setAttribute("slot", "visible");
                this.#currentPanel = panelEl;
                if (typeof refreshFn === "function") {
                    await refreshFn();
                }
                if (navConfig != null) {
                    this.#navbarEl.loadNavigation(this.buildNav(navConfig));
                } else {
                    this.#navbarEl.loadNavigation(this.buildNav(this.#defaultNav));
                }
            }
        }
    }

    close() {
        window.close();
    }

    buildNav(navConfig = []) {
        return navConfig;
    }

}

customElements.define("jse-window", EditorWindow);
