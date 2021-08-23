import Template from "/emcJS/util/html/Template.js";

const TPL = new Template(`
<style>
    * {
        box-sizing: border-box;
    }
    :host {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    #choice {
        display: flex;
        flex-wrap: wrap;
        padding: 5px;
    }
    #choice div {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 100px;
        margin: 5px;
        color: white;
        background-color: #222;
        cursor: pointer;
    }
</style>
<slot id="container" name="visible">
    <div id="choice">
    </div>
</slot>
`);

const CURRENT = new WeakMap();

export default class EditorChoice extends HTMLElement {

    constructor() {
        super();
        CURRENT.set(this, null);
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
    }

    closeCurrent() {
        const current = CURRENT.get(this);
        if (current != null) {
            current.removeAttribute("slot");
        }
        const ev = new Event('choice');
        ev.app = "";
        this.dispatchEvent(ev);
    }

    register(pnl, name) {
        this.append(pnl);
        const el = document.createElement("DIV");
        el.innerHTML = name;
        el.addEventListener("click", event => {
            const ev = new Event('choice');
            ev.app = name;
            this.dispatchEvent(ev);
            const current = CURRENT.get(this);
            if (current != null) {
                current.removeAttribute("slot");
            }
            pnl.setAttribute("slot", "visible");
            CURRENT.set(this, pnl);
        });
        this.shadowRoot.getElementById("choice").append(el);
    }

}

customElements.define('jse-choice', EditorChoice);
