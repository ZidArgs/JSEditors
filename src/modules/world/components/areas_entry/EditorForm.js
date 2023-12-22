import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
import "/emcJS/ui/i18n/I18nLabel.js";
import "../../ui/field/FilterInput.js";
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

    #headerNameEl;

    #filterInputEl;

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
        this.#headerNameEl = this.shadowRoot.getElementById("header-name");
        this.#detailFormEl = this.shadowRoot.getElementById("detail-form");
        this.#formContext.registerForm(this.#detailFormEl);
        this.#prepareForm();
        /* --- */
        const headerFormEl = this.shadowRoot.getElementById("header-form");
        this.#formContext.registerForm(headerFormEl);
        const footerFormEl = this.shadowRoot.getElementById("footer-form");
        this.#formContext.registerForm(footerFormEl);
        /* --- */
        this.#filterInputEl = this.shadowRoot.getElementById("filter-input");
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
        /* --- */
        const mapImageSelectEl = this.#detailFormEl.querySelector("#mapselect");
        const mapImageWidthEl = this.#detailFormEl.querySelector("#mapwidth");
        const mapImageHeightEl = this.#detailFormEl.querySelector("#mapheight");
        mapImageSelectEl.addEventListener("change", () => {
            const img = new Image();
            img.onload = () => {
                mapImageWidthEl.value = img.naturalWidth;
                mapImageHeightEl.value = img.naturalHeight;
            };
            img.onerror = () => {
                mapImageWidthEl.value = 0;
                mapImageHeightEl.value = 0;
            }
            img.src = mapImageSelectEl.value;
        });
    }

    setName(value) {
        this.#headerNameEl.i18nValue = value;
    }

    setData(data) {
        this.#formContext.loadData(data);
    }

    getData() {
        return this.#formContext.getData();
    }

    setFilterConfig(config) {
        this.#filterInputEl.loadFilterConfig(config);
    }

}

customElements.define("jse-world-form-areas-entry", EditorForm_Areas_Entry);
