import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormElementRegistry from "/emcJS/data/registry/FormElementRegistry.js"
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import FormFieldset from "/emcJS/ui/form/FormFieldset.js";
import FormButtonRow from "/emcJS/ui/form/FormButtonRow.js";
import ActionButton from "/emcJS/ui/form/button/ActionButton.js";
import LinkButton from "/emcJS/ui/form/button/LinkButton.js";
import SubmitButton from "/emcJS/ui/form/button/SubmitButton.js";
import ResetButton from "/emcJS/ui/form/button/ResetButton.js";
import {
    extractDefaultValuesFromConfig
} from "/emcJS/util/helper/ui/Form.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
// import "../../../ui/SimpleLogicEdit.js";
import TPL from "./Workingarea.js.html" assert {type: "html"};
import STYLE from "./Workingarea.js.css" assert {type: "css"};

const SPECIAL_FORM_ELEMENTS = {
    "Fieldset": FormFieldset,
    "ButtonRow": FormButtonRow,
    "ActionButton": ActionButton,
    "LinkButton": LinkButton,
    "SubmitButton": SubmitButton,
    "ResetButton": ResetButton
};

const FORM_ELEMENT_TYPES = [...Object.keys(SPECIAL_FORM_ELEMENTS), ...FormElementRegistry.getRegisteredRefs()];

function addTypeSelectOptions(formEl) {
    for (const ref of FORM_ELEMENT_TYPES) {
        const optionEl = document.createElement("emc-option");
        optionEl.setAttribute("value", ref);
        const labelEl = document.createElement("emc-i18n-label");
        labelEl.i18nValue = ref;
        optionEl.append(labelEl);
        formEl.append(optionEl);
    }
}

function getDetailConfig(ref) {
    if (ref in SPECIAL_FORM_ELEMENTS) {
        return SPECIAL_FORM_ELEMENTS[ref].formConfigurationFields;
    }
    const clazz = FormElementRegistry.getRegisteredClass(ref);
    if (clazz != null) {
        return clazz.formConfigurationFields
    }
    return [];
}

export default class Workingarea extends CustomElement {

    #formContext = new FormContext();

    #typeSelectEl;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#formContext.addEventListener("submit", () => {
            const valid = this.#formContext.getFormValidity() ? "valid" : "invalid";
            console.group(`submit (${valid})`);
            console.log("changed data", this.#formContext.getChanges());
            console.log("all data", this.#formContext.getData());
            console.log("form data", this.#formContext.getFormData());
            console.log("hidden form data", this.#formContext.getHiddenFormData());
            console.groupEnd(`submit (${valid})`);
        });
        /* --- */
        this.#typeSelectEl = this.shadowRoot.getElementById("type-select");
        this.#typeSelectEl.addEventListener("change", () => {
            const config = getDetailConfig(this.#typeSelectEl.value);
            const defaults = extractDefaultValuesFromConfig(config);
            this.setDetailConfig(config);
            this.#formContext.loadData(defaults);
        });
        addTypeSelectOptions(this.#typeSelectEl);
    }

    connectedCallback() {
        this.loadFormElement({type: "Fieldset"});
    }

    setDetailConfig(config) {
        const cnt = this.shadowRoot.getElementById("details");
        const oldFormEl = this.shadowRoot.getElementById("form");
        if (oldFormEl != null) {
            this.#formContext.unregisterForm(oldFormEl);
            cnt.innerHTML = "";
        }
        /* --- */
        const formEl = FormBuilder.build(config);
        formEl.id = "form";
        cnt.append(formEl);
        this.#formContext.registerForm(formEl);
    }

    loadFormElement(data) {
        const {type, props} = data;
        this.#typeSelectEl.value = type;
        this.#formContext.loadData(props);
    }

    getData() { // TODO
        return this.#formContext.getData();
    }

    loadData(data) { // TODO
        this.#formContext.loadData(data);
    }

}

customElements.define("jse-form-workingarea", Workingarea);
