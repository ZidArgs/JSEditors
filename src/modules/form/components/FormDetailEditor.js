import CustomElement from "/emcJS/ui/element/CustomElement.js";
// import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import "/emcJS/ui/form/FormButtonRow.js";
import "/emcJS/ui/form/button/SubmitButton.js";
import "/emcJS/ui/form/button/ResetButton.js";
import "/emcJS/ui/form/FormContainer.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
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
        const controlFormEl = this.shadowRoot.getElementById("control-form");
        this.#formContext.registerForm(controlFormEl);
        const detailFormEl = this.shadowRoot.getElementById("detail-form");
        this.#formContext.registerForm(detailFormEl);
    }

    setData(data) {
        this.#formContext.loadData({...data});
    }

    getData() {
        return this.#formContext.getData();
    }

}

customElements.define("jse-form-editor-detail-form", FormDetailEditor);
