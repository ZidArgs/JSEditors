import Template from "/emcJS/util/Template.js";
import "/emcJS/ui/NavBar.js";
import "./EditorChoice.js";

const TITLE_PREFIX = "Editor";

const TPL = new Template(`
<style>
    * {
        box-sizing: border-box;
    }
    :host {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        margin: 0px;
        background-color: var(--page-background-color, #000000);
        color: var(--page-text-color, #ffffff);
    }
</style>
<slot>
</slot>
`);

const NAVI = document.createElement('emc-navbar');
const CHOICE = document.createElement('jse-choice');

const MAIN_NAV = [{
    "content": "EXIT",
    "handler": () => {
        window.close()
    }
}];

const DEFAULT_NAV = [{
    "content": "EXIT",
    "handler": () => {
        CHOICE.closeCurrent();
    }
}];

const PANELS = new Map();

CHOICE.addEventListener("choice", function(event) {
    if (event.app == "") {
        document.title = TITLE_PREFIX;
        NAVI.loadNavigation(MAIN_NAV);
    } else {
        document.title = `${TITLE_PREFIX} - ${event.app}`;
        let data = PANELS.get(event.app);
        if (typeof data.refreshFn == "function") {
            data.refreshFn();
        }
        if (data.navigation != null) {
            NAVI.loadNavigation(data.navigation);
        } else {
            NAVI.loadNavigation(DEFAULT_NAV);
        }
    }
});
NAVI.loadNavigation(MAIN_NAV);

export default class EditorWindow extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
    }

    connectedCallback() {
        this.innerHTML = "";
        this.append(NAVI);
        this.append(CHOICE);
    }

    register(name, panel, navigation, refreshFn) {
        if (PANELS.has(name)) {
            throw Error(`Panel with name "${name}" already registered`);
        }
        PANELS.set(name, {
            navigation: navigation,
            refreshFn: refreshFn
        });
        CHOICE.register(panel, name);
    }

    closeCurrent() {
        CHOICE.closeCurrent();
    }

}

customElements.define('jse-window', EditorWindow);