import Template from "/emcJS/util/Template.js";

const TPL = new Template(`
<style>
    :root {
        display: flex;
        flex-wrap: wrap;
        padding: 5px;
    }
    div {
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
`);

class EditorChoice extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
    }

    register(id, name = id) {
        let el = document.createElement("DIV");
        el.innerHTML = name;
        el.addEventListener("click", event => {
            let ev = new Event('choice');
            ev.app = id;
            this.dispatchEvent(ev);
        });
        this.shadowRoot.append(el);
    }

}

customElements.define('ted-editorchoice', EditorChoice);