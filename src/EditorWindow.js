import Template from "/emcJS/util/Template.js";
import "/emcJS/ui/navigation/NavBar.js";
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

const MAIN_NAV = [{
    "content": "EXIT",
    "handler": () => {
        window.close()
    }
}];

const NAVI = new WeakMap();
const CHOICE = new WeakMap();
const PANELS = new WeakMap();

function onChoice(event) {
    if (event.app == "") {
        document.title = TITLE_PREFIX;
        NAVI.get(this).loadNavigation(MAIN_NAV);
    } else {
        document.title = `${TITLE_PREFIX} - ${event.app}`;
        const data = PANELS.get(this).get(event.app);
        if (typeof data.refreshFn == "function") {
            data.refreshFn();
        }
        if (data.navigation != null) {
            NAVI.get(this).loadNavigation(data.navigation);
        } else {
            NAVI.get(this).loadNavigation([{
                "content": "EXIT",
                "handler": () => {
                    CHOICE.get(this).closeCurrent();
                }
            }]);
        }
    }
}

export default class EditorWindow extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());

        const navi = document.createElement('emc-navbar');
        navi.loadNavigation(MAIN_NAV);
        NAVI.set(this, navi);

        const choice = document.createElement('jse-choice');
        choice.addEventListener("choice", onChoice.bind(this));
        CHOICE.set(this, choice);

        PANELS.set(this, new Map());
    }

    connectedCallback() {
        this.innerHTML = "";
        this.append(NAVI.get(this));
        this.append(CHOICE.get(this));
    }

    register(name, panel, navigation, refreshFn) {
        if (PANELS.get(this).has(name)) {
            throw Error(`Panel with name "${name}" already registered`);
        }
        PANELS.get(this).set(name, {
            navigation: navigation,
            refreshFn: refreshFn
        });
        panel.addEventListener("close", () => this.closeCurrent());
        CHOICE.get(this).register(panel, name);
    }

    closeCurrent() {
        CHOICE.get(this).closeCurrent();
    }

}

customElements.define('jse-window', EditorWindow);
