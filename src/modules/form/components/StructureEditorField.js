import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormElementRegistry from "/emcJS/data/registry/FormElementRegistry.js";
import "/emcJS/ui/form/FormFieldset.js";
import "/emcJS/ui/form/FormButtonRow.js";
import "/emcJS/ui/form/button/SubmitButton.js";
import "/emcJS/ui/form/button/ResetButton.js";
import "/emcJS/ui/form/button/ActionButton.js";
import "/emcJS/ui/form/button/LinkButton.js";
import TPL from "./StructureEditorField.js.html" assert {type: "html"};
import STYLE from "./StructureEditorField.js.css" assert {type: "css"};

export default class StructureEditorField extends CustomElement {

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        const addButtonEl = this.shadowRoot.getElementById("add");
        const editButtonEl = this.shadowRoot.getElementById("edit");
        const removeButtonEl = this.shadowRoot.getElementById("remove");
        addButtonEl.addEventListener("click", () => {
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const event = new Event("add", {bubbles: true, cancelable: true});
            event.elPath = [targetIndex];
            this.dispatchEvent(event);
        });
        editButtonEl.addEventListener("click", () => {
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const event = new Event("edit", {bubbles: true, cancelable: true});
            event.elPath = [targetIndex];
            this.dispatchEvent(event);
        });
        removeButtonEl.addEventListener("click", () => {
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const event = new Event("remove", {bubbles: true, cancelable: true});
            event.elPath = [targetIndex];
            this.dispatchEvent(event);
        });
        /* --- */
        const containerEl = this.shadowRoot.getElementById("container");
        containerEl.addEventListener("add", (event) => {
            event.stopPropagation();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("add", {bubbles: true, cancelable: true});
            if (event.elPath != null) {
                ev.elPath = [targetIndex, ...event.elPath];
            } else {
                ev.elPath = [targetIndex];
            }
            this.dispatchEvent(ev);
        });
        containerEl.addEventListener("edit", (event) => {
            event.stopPropagation();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("edit", {bubbles: true, cancelable: true});
            if (event.elPath != null) {
                ev.elPath = [targetIndex, ...event.elPath];
                ev.elPosition = event.elPosition;
            } else {
                ev.elPath = [targetIndex];
                ev.elPosition = targetIndex;
            }
            this.dispatchEvent(ev);
        });
        containerEl.addEventListener("remove", (event) => {
            event.stopPropagation();
            const targetIndex = Array.from(this.parentElement.children).indexOf(this);
            const ev = new Event("remove", {bubbles: true, cancelable: true});
            if (event.elPath != null) {
                ev.elPath = [targetIndex, ...event.elPath];
                ev.elPosition = event.elPosition;
            } else {
                ev.elPath = [targetIndex];
                ev.elPosition = targetIndex;
            }
            this.dispatchEvent(ev);
        });
    }

    loadConfig(config, path = []) {
        if (!path.length) {
            this.#applyConfig(config)
        } else {
            const nextIndex = path.shift();
            const targetEl = this.children.item(nextIndex)?.querySelector("jse-form-editor-structure");
            if (targetEl != null) {
                targetEl.loadConfig(config);
            }
        }
    }

    #applyConfig(config) {
        this.innerHTML = "";

        if (config != null) {
            if (Array.isArray(config)) {
                for (const option of config) {
                    this.append(this.#createOption(option));
                }
            } else {
                this.append(this.#createOption(config));
            }
        }
    }

    #createOption(option = {}) {
        const {type, id, visible, enabled, ...params} = option;
        switch (type) {
            case "SubmitButton": {
                return this.#createSubmitButton(id, visible, enabled, params);
            }
            case "ResetButton": {
                return this.#createResetButton(id, visible, enabled, params);
            }
            case "ActionButton": {
                return this.#createActionButton(id, visible, enabled, params);
            }
            case "LinkButton": {
                return this.#createLinkButton(id, visible, enabled, params);
            }
            case "Fieldset": {
                return this.#createFieldset(id, visible, enabled, params);
            }
            case "ButtonRow": {
                return this.#createButtonRow(id, visible, enabled, params);
            }
            default: {
                return this.#createField(type, id, visible, enabled, params);
            }
        }
    }

    #createField(type, id, visible, enabled, config = {}) {
        const {value, name, ...params} = config;
        if (id != null) {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"} [#${id}]`;
        } else {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"}`;
        }
        /* --- */
        const el = FormElementRegistry.create(type, params);
        if (value != null) {
            if (typeof value === "object") {
                el.setAttribute("value", JSON.stringify(value));
            } else {
                el.setAttribute("value", value);
            }
        } else {
            el.removeAttribute("value");
        }
        return el;
    }

    #createSubmitButton(id, visible, enabled, config = {}) {
        const {name, ...params} = config;
        if (id != null) {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"} [#${id}]`;
        } else {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"}`;
        }
        /* --- */
        const el = document.createElement("emc-button-submit");
        if (params.name != null) {
            el.name = params.name;
        }
        if (params.text != null) {
            el.text = params.text;
        }
        if (params.tooltip != null) {
            el.tooltip = params.tooltip;
        }
        if (params.disabled != null) {
            el.disabled = params.disabled;
        }
        return el;
    }

    #createResetButton(id, visible, enabled, config = {}) {
        const {name, ...params} = config;
        if (id != null) {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"} [#${id}]`;
        } else {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"}`;
        }
        /* --- */
        const el = document.createElement("emc-button-reset");
        if (params.name != null) {
            el.name = params.name;
        }
        if (params.text != null) {
            el.text = params.text;
        }
        if (params.tooltip != null) {
            el.tooltip = params.tooltip;
        }
        if (params.disabled != null) {
            el.disabled = params.disabled;
        }
        return el;
    }

    #createActionButton(id, visible, enabled, config = {}) {
        const {name, ...params} = config;
        if (id != null) {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"} [#${id}]`;
        } else {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"}`;
        }
        /* --- */
        const el = document.createElement("emc-button-action");
        if (params.name != null) {
            el.name = params.name;
        }
        if (params.text != null) {
            el.text = params.text;
        }
        if (params.icon != null) {
            el.icon = params.icon;
        }
        if (params.tooltip != null) {
            el.tooltip = params.tooltip;
        }
        if (params.action != null) {
            el.action = params.action;
        }
        if (params.disabled != null) {
            el.disabled = params.disabled;
        }
        return el;
    }

    #createLinkButton(id, visible, enabled, config = {}) {
        const {name, ...params} = config;
        if (id != null) {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"} [#${id}]`;
        } else {
            this.shadowRoot.getElementById("name").innerHTML = `@${name || "[unnamed]"}`;
        }
        /* --- */
        const el = document.createElement("emc-button-link");
        if (params.name != null) {
            el.name = params.name;
        }
        if (params.text != null) {
            el.text = params.text;
        }
        if (params.icon != null) {
            el.icon = params.icon;
        }
        if (params.tooltip != null) {
            el.tooltip = params.tooltip;
        }
        if (params.href != null) {
            el.href = params.href;
        }
        if (params.disabled != null) {
            el.disabled = params.disabled;
        }
        return el;
    }

    #createFieldset(id, visible, enabled, params = {}) {
        if (id != null) {
            this.shadowRoot.getElementById("name").innerHTML = `[#${id}]`;
        }
        /* --- */
        const el = document.createElement("emc-form-fieldset");
        if (params.label != null) {
            el.label = params.label;
        }
        if (params.desc != null) {
            el.desc = params.desc;
        }
        if (params.tooltip != null) {
            el.tooltip = params.tooltip;
        }
        const structureEl = document.createElement("jse-form-editor-structure");
        structureEl.loadConfig(params.children);
        el.append(structureEl);
        return el;
    }

    #createButtonRow(id, visible, enabled, params = {}) {
        if (id != null) {
            this.shadowRoot.getElementById("name").innerHTML = `[#${id}]`;
        }
        /* --- */
        const el = document.createElement("emc-form-buttonrow");
        const structureEl = document.createElement("jse-form-editor-structure");
        structureEl.loadConfig(params.children);
        el.append(structureEl);
        return el;
    }

}

customElements.define("jse-form-editor-structure-field", StructureEditorField);
