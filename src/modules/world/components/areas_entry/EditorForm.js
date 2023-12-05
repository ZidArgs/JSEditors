import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
import TPL from "./EditorForm.js.html" assert {type: "html"};
import STYLE from "./EditorForm.js.css" assert {type: "css"};
import FORM_CONFIG from "./EditorForm.js.json" assert {type: "json"};

/* TODO add new entries via dialog
    - choose if either "collection" or one of the entries of the locations, exits and areas
    - if "collection" fill in "type" automatically
    - if "location", "exit" or "area", fill in "type" and "ref" automatically
*/

export default class EditorForm_Areas_Entry extends CustomElement {

    #formContext = new FormContext();

    #detailFormEl;

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
        this.#detailFormEl = this.shadowRoot.getElementById("detail-form");
        this.#formContext.registerForm(this.#detailFormEl);
        this.#prepareForm();
        /* --- */
        const headerFormEl = this.shadowRoot.getElementById("header-form");
        this.#formContext.registerForm(headerFormEl);
        const footerFormEl = this.shadowRoot.getElementById("footer-form");
        this.#formContext.registerForm(footerFormEl);
    }

    #prepareForm() {
        FormBuilder.replaceForm(this.#detailFormEl, FORM_CONFIG);
        const visibleLogicEl = this.#detailFormEl.querySelector("[name=\"visible\"]");
        if (visibleLogicEl != null) {
            visibleLogicEl.addOperatorGroup("special");
            visibleLogicEl.addOperatorGroup("items");
            visibleLogicEl.addOperatorGroup("options");
            visibleLogicEl.addOperatorGroup("settings");
            visibleLogicEl.addOperatorGroup("filter");
            visibleLogicEl.addOperatorGroup("locations done");
        }
    }

    setData(data) {
        this.#formContext.loadData(data);
    }

    getData() {
        return this.#formContext.getData();
    }

}

customElements.define("jse-world-form-areas-entry", EditorForm_Areas_Entry);
