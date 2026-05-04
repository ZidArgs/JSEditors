import CustomElement from "@emcjs/fe/ui/element/CustomElement.js";
import FormContext from "@emcjs/fe/util/form/context/FormContext.js";
import "@emcjs/fe/loader/FormComponentsLoader.js";
import TPL from "./FormDetailEditor.js.html" assert {type: "html"};
import STYLE from "./FormDetailEditor.js.css" assert {type: "css"};

export default class FormDetailEditor extends CustomElement {

    #formContext = new FormContext();

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#formContext.addEventListener("submit", () => {
            const event = new Event("save", {bubbles: true, cancelable: true});
            event.data = {
                ...this.#formContext.getData()
            };
            this.dispatchEvent(event);
        });
        /* --- */
        const footerFormEl = this.shadowRoot.getElementById("footer-form");
        this.#formContext.registerForm(footerFormEl);
        const detailFormEl = this.shadowRoot.getElementById("detail-form");
        this.#formContext.registerForm(detailFormEl);
    }

    setData(data) {
        this.#formContext.setData({...data});
    }

    getData() {
        return this.#formContext.getData();
    }

}

customElements.define("jse-form-editor-detail-form", FormDetailEditor);
