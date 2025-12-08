import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormElementRegistry from "/emcJS/data/registry/form/FormElementRegistry.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import EventTargetManager from "/emcJS/util/event/EventTargetManager.js";
import {
    extractDefaultValuesFromConfig
} from "/emcJS/util/helper/ui/Form.js";
import { FORM_BUTTON_MAPPING, FORM_STRUCTURE_MAPPING } from "/emcJS/ui/form/FormComponentsLoader.js";
import "/emcJS/ui/form/FormContainer.js";
import TPL from "./FormElementDetailEditor.js.html" assert {type: "html"};
import STYLE from "./FormElementDetailEditor.js.css" assert {type: "css"};

const FORM_ELEMENT_TYPES = new Set([...FORM_STRUCTURE_MAPPING.keys(), ...FORM_BUTTON_MAPPING.keys(), ...FormElementRegistry.getRegisteredRefs()]);

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
        if (FORM_STRUCTURE_MAPPING.has(ref)) {
            return FORM_STRUCTURE_MAPPING.get(ref).formConfigurationFields;
        }
        if (FORM_BUTTON_MAPPING.has(ref)) {
            return FORM_BUTTON_MAPPING.get(ref).formConfigurationFields;
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
        if (FORM_STRUCTURE_MAPPING.has(ref)) {
            return FORM_STRUCTURE_MAPPING.get(ref).formConfigurationCanHaveChildren;
        }
        if (FORM_BUTTON_MAPPING.has(ref)) {
            return FORM_BUTTON_MAPPING.get(ref).formConfigurationCanHaveChildren;
        }
        const clazz = FormElementRegistry.getRegisteredClass(ref);
        if (clazz != null) {
            return clazz.formConfigurationCanHaveChildren;
        }
    }
    return false;
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

        this.#formContext.setData({...defaults, ...values, type});
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
