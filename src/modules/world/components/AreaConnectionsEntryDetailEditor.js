import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
import "./field/PositionInput";
import TPL from "./AreaConnectionsEntryDetailEditor.js.html" assert {type: "html"};
import STYLE from "./AreaConnectionsEntryDetailEditor.js.css" assert {type: "css"};
import FORM_CONFIG from "./AreaConnectionsEntryDetailEditor.js.json" assert {type: "json"};

export default class AreaConnectionsEntryDetailEditor extends CustomElement {

    #formContext = new FormContext();

    #detailFormEl;

    #posInput0El;

    #posInput1El;

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
        /* --- */
        this.#posInput0El = this.shadowRoot.getElementById("pos-input-0");
        this.#posInput1El = this.shadowRoot.getElementById("pos-input-1");
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
        const {mapConfig, connections, list, index, entry} = data;
        this.#posInput0El.loadData(mapConfig, connections, list, "connection", `${index}_0`, entry.label);
        this.#posInput1El.loadData(mapConfig, connections, list, "connection", `${index}_1`, entry.label);
        // TODO entangle position inputs
        this.#formContext.loadData(entry);
    }

    getData() {
        return this.#formContext.getData();
    }

}

customElements.define("jse-world-editor-detail-area-connections-entry", AreaConnectionsEntryDetailEditor);
