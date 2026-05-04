import CustomElement from "@emcjs/fe/ui/element/CustomElement.js";
import TPL from "./EditorChoice.js.html" assert {type: "html"};
import STYLE from "./EditorChoice.js.css" assert {type: "css"};

export default class EditorChoice extends CustomElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
    }

    register(name) {
        const el = document.createElement("DIV");
        el.innerHTML = name;
        el.addEventListener("click", () => {
            const ev = new Event("choice");
            ev.app = name;
            this.dispatchEvent(ev);
        });
        this.shadowRoot.getElementById("choice").append(el);
    }

}

customElements.define("jse-choice", EditorChoice);
