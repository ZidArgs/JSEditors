import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormElementRegistry from "/emcJS/data/registry/form/FormElementRegistry.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import EventTargetManager from "/emcJS/util/event/EventTargetManager.js";
import FormFieldset from "/emcJS/ui/form/FormFieldset.js";
import FormRow from "/emcJS/ui/form/FormRow.js";
import ActionButton from "/emcJS/ui/form/button/ActionButton.js";
import LinkButton from "/emcJS/ui/form/button/LinkButton.js";
import SubmitButton from "/emcJS/ui/form/button/SubmitButton.js";
import ResetButton from "/emcJS/ui/form/button/ResetButton.js";
import {
    extractDefaultValuesFromConfig
} from "/emcJS/util/helper/ui/Form.js";
import "/emcJS/ui/form/FormContainer.js";
import "/emcJS/ui/form/element/FormElementsLoader.js";
import TPL from "./FormElementDetailEditor.js.html" assert {type: "html"};
import STYLE from "./FormElementDetailEditor.js.css" assert {type: "css"};

const SPECIAL_FORM_ELEMENTS = {
    "Fieldset": FormFieldset,
    "Row": FormRow,
    "ActionButton": ActionButton,
    "LinkButton": LinkButton,
    "SubmitButton": SubmitButton,
    "ResetButton": ResetButton
};

const FORM_ELEMENT_TYPES = [...Object.keys(SPECIAL_FORM_ELEMENTS), ...FormElementRegistry.getRegisteredRefs()];

function addTypeSelectOptions(formEl) {
    for (const ref of FORM_ELEMENT_TYPES) {
        const optionEl = document.createElement("option");
        optionEl.setAttribute("value", ref);
        optionEl.setAttribute("label", ref);
        formEl.append(optionEl);
    }
}

function getDetailConfig(ref) {
    if (ref) {
        if (ref in SPECIAL_FORM_ELEMENTS) {
            return SPECIAL_FORM_ELEMENTS[ref].formConfigurationFields;
        }
        const clazz = FormElementRegistry.getRegisteredClass(ref);
        if (clazz != null) {
            return clazz.formConfigurationFields;
        }
    }
    return [];
}

function getDetailCanHaveChildren(ref) {
    if (ref) {
        if (ref in SPECIAL_FORM_ELEMENTS) {
            return SPECIAL_FORM_ELEMENTS[ref].formConfigurationCanHaveChildren;
        }
        const clazz = FormElementRegistry.getRegisteredClass(ref);
        if (clazz != null) {
            return clazz.formConfigurationCanHaveChildren;
        }
    }
    return [];
}

export default class FormElementDetailEditor extends CustomElement {

    #formContext = new FormContext();

    #detailFormEl;

    #typeSelectEl;

    #typeSelectEventManager = new EventTargetManager();

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        this.#formContext.addEventListener("submit", () => {
            const event = new Event("save", {bubbles: true, cancelable: true});
            const type = this.#typeSelectEl.value;
            const canHaveChildren = getDetailCanHaveChildren(type);
            if (canHaveChildren) {
                event.data = {
                    children: [],
                    ...this.#formContext.getData()
                };
            } else {
                event.data = {
                    ...this.#formContext.getData()
                };
            }
            this.dispatchEvent(event);
        });
        /* --- */
        this.#detailFormEl = this.shadowRoot.getElementById("detail-form");
        this.#formContext.registerForm(this.#detailFormEl);
        /* --- */
        this.#typeSelectEl = this.shadowRoot.getElementById("type-select");
        this.#typeSelectEventManager.switchTarget(this.#typeSelectEl);
        this.#typeSelectEventManager.set("change", () => {
            const type = this.#typeSelectEl.value;
            this.setData({type});
        });
        addTypeSelectOptions(this.#typeSelectEl);
        /* --- */
        const headerFormEl = this.shadowRoot.getElementById("header-form");
        this.#formContext.registerForm(headerFormEl);
        const footerFormEl = this.shadowRoot.getElementById("footer-form");
        this.#formContext.registerForm(footerFormEl);
    }

    setData(data) {
        this.#typeSelectEventManager.active = false;
        const {type, ...values} = data ?? {};
        const config = getDetailConfig(type);
        const defaults = extractDefaultValuesFromConfig(config);

        FormBuilder.replaceForm(this.#detailFormEl, config);

        this.#formContext.loadData({...defaults, ...values, type});
        this.#typeSelectEventManager.active = true;

        const editableLogicEl = this.#detailFormEl.querySelector("[name=\"editable\"]");
        if (editableLogicEl != null) {
            editableLogicEl.addOperatorGroup("formFields");
        }
        const enabledLogicEl = this.#detailFormEl.querySelector("[name=\"enabled\"]");
        if (enabledLogicEl != null) {
            enabledLogicEl.addOperatorGroup("formFields");
        }
        const visibleLogicEl = this.#detailFormEl.querySelector("[name=\"visible\"]");
        if (visibleLogicEl != null) {
            visibleLogicEl.addOperatorGroup("formFields");
        }
    }

    getData() {
        return this.#formContext.getData();
    }

}

customElements.define("jse-form-editor-detail-form-element", FormElementDetailEditor);
