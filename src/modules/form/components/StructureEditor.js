import CustomElement from "/emcJS/ui/element/CustomElement.js";
import ElementManager from "/emcJS/util/html/ElementManager.js";
import "/emcJS/ui/form/FormFieldset.js";
import "/emcJS/ui/form/FormButtonRow.js";
import "/emcJS/ui/form/button/ActionButton.js";
import "/emcJS/ui/form/button/LinkButton.js";
import "/emcJS/ui/form/button/SubmitButton.js";
import "/emcJS/ui/form/button/ResetButton.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
// import "../../../ui/SimpleLogicEdit.js";
import "./StructureEditorField.js";
import TPL from "./StructureEditor.js.html" assert {type: "html"};
import STYLE from "./StructureEditor.js.css" assert {type: "css"};

function tokenComposer(key, params) {
    const el = document.createElement("jse-form-editor-structure-field");
    el.dataset.key = key;
    el.loadConfig(params.config);
    return el;
}

function tokenMutator(el, key, params) {
    el.loadConfig(params.config);
}

export default class StructureEditor extends CustomElement {

    #elManager;

    constructor() {
        super();
        this.shadowRoot.append(TPL.generate());
        STYLE.apply(this.shadowRoot);
        /* --- */
        const newButtonEl = this.shadowRoot.getElementById("add");
        newButtonEl.addEventListener("click", () => {
            const event = new Event("add", {bubbles: true, cancelable: true});
            event.elPath = [-1];
            this.dispatchEvent(event);
        });
        /* --- */
        this.#elManager = new ElementManager(this, {
            composer: tokenComposer,
            mutator: tokenMutator
        });
    }

    connectedCallback() {
        // TODO
    }

    getData() {
        // TODO
    }

    loadConfig(config, path = []) {
        if (!path.length) {
            this.#applyConfig(config)
        } else {
            const nextIndex = path.shift();
            const targetEl = this.children.item(nextIndex);
            if (targetEl != null) {
                targetEl.loadConfig(config, path);
            }
        }
    }

    #applyConfig(config) {
        const data = [];
        for (const key in config) {
            const value = config[key];
            data.push({
                key: value._elID,
                config: value
            });
        }
        this.#elManager.manage(data);
    }

}

customElements.define("jse-form-editor-structure", StructureEditor);
