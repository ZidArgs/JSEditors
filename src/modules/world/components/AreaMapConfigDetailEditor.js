import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
import TPL from "./AreaMapConfigDetailEditor.js.html" assert {type: "html"};
import STYLE from "./AreaMapConfigDetailEditor.js.css" assert {type: "css"};
import FORM_CONFIG from "./AreaMapConfigDetailEditor.js.json" assert {type: "json"};

export default class AreaMapConfigDetailEditor extends CustomElement {

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

    setData(data) {
        this.#formContext.loadData(data);
    }

    getData() {
        return this.#formContext.getData();
    }

}

customElements.define("jse-world-editor-detail-area-map-config", AreaMapConfigDetailEditor);
