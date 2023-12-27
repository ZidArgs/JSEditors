import Modal from "/emcJS/ui/modal/Modal.js";
import CharacterSearch from "/emcJS/util/search/CharacterSearch.js";
import ElementListCache from "/emcJS/util/html/ElementListCache.js";
import EventMultiTargetManager from "/emcJS/util/event/EventMultiTargetManager.js";
import EventTargetManager from "/emcJS/util/event/EventTargetManager.js";
import i18n from "/emcJS/util/I18n.js";
import {
    debounce
} from "/emcJS/util/Debouncer.js";
import {
    sortNodeList
} from "/emcJS/util/helper/ui/NodeListSort.js";
import Comparator from "/emcJS/util/helper/Comparator.js";
import "/emcJS/ui/form/button/Button.js";
import "/emcJS/ui/form/element/input/search/SearchInput.js";
import TPL from "./CoordinatesInputModal.js.html" assert {type: "html"};
import STYLE from "./CoordinatesInputModal.js.css" assert {type: "css"};

export default class CoordinatesInputModal extends Modal {

    #slotEl;

    #optionNodeList = new ElementListCache();

    #optionSelectEventManager = new EventMultiTargetManager();

    #i18nEventManager = new EventTargetManager(i18n);

    constructor() {
        super("Select icon...");
        const els = TPL.generate();
        STYLE.apply(this.shadowRoot);
        /* --- */
        const footerEl = this.shadowRoot.getElementById("footer");
        const contentEl = this.shadowRoot.getElementById("content");

        const searchEl = els.getElementById("search");
        contentEl.before(searchEl);
        searchEl.addEventListener("change", () => {
            const all = this.children;
            if (searchEl.value) {
                const regEx = new CharacterSearch(searchEl.value);
                for (const el of all) {
                    const testText = el.comparatorText ?? el.innerText;
                    if (regEx.test(testText.trim())) {
                        el.style.display = "";
                    } else {
                        el.style.display = "none";
                    }
                }
            } else {
                for (const el of all) {
                    el.style.display = "";
                }
            }
        });

        const cancelEl = els.getElementById("cancel");
        cancelEl.addEventListener("click", () => this.cancel());
        footerEl.append(cancelEl);

        const submitEl = els.getElementById("submit");
        submitEl.addEventListener("click", () => this.submit());
        footerEl.append(submitEl);
        /* --- */
        this.#optionSelectEventManager.set("click", (event) => {
            this.value = event.currentTarget.getAttribute("value");
            event.preventDefault();
            event.stopPropagation();
        });
        /* --- */
        this.#slotEl = this.shadowRoot.getElementById("slot");
        this.#slotEl.addEventListener("slotchange", () => {
            this.#onSlotChange();
        });
        /* --- */
        this.#i18nEventManager.setActive(this.getBooleanAttribute("sorted"));
        this.#i18nEventManager.set("language", () => {
            this.#sort();
        });
        this.#i18nEventManager.set("translation", () => {
            this.#sort();
        });
    }

    submit() {
        this.dispatchEvent(new Event("submit"));
        this.remove();
    }

    cancel() {
        this.dispatchEvent(new Event("cancel"));
        this.remove();
    }

    set value(value) {
        if (value == null) {
            this.removeAttribute("value");
        } else {
            this.setAttribute("value", value);
        }
    }

    get value() {
        return this.getAttribute("value") ?? this.#optionNodeList.first?.value;
    }

    loadOptions(options) {
        this.innerHTML = "";
        for (const value in options) {
            const optionEl = document.createElement("emc-select-image-preview");
            optionEl.value = value;
            optionEl.src = value;
            optionEl.text = options[value];
            optionEl.addEventListener("click", () => {
                this.value = value;
            });
            this.append(optionEl);
        }
    }

    static get observedAttributes() {
        return ["value"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value": {
                if (oldValue != newValue) {
                    this.#applyValue(newValue);
                }
            } break;
        }
    }

    #resolveSlottedElements() {
        const optionNodeList = this.#slotEl.assignedElements({flatten: true}).filter((el) => el.matches("[value]"));
        this.#optionNodeList.setNodeList(optionNodeList);
        /* --- */
        this.#optionSelectEventManager.clearTargets();
        for (const el of optionNodeList) {
            this.#optionSelectEventManager.addTarget(el);
        }
        /* --- */
        this.#sort();

        this.#applyValue(this.value);
    }

    #sort = debounce(() => {
        const optionNodeList = this.#optionNodeList.getNodeList();
        const sortedNodeList = sortNodeList(optionNodeList);
        if (!Comparator.isEqual(optionNodeList, sortedNodeList)) {
            for (const el of sortedNodeList) {
                (el.parentElement ?? el.getRootNode() ?? document).append(el);
            }
        }
        this.#optionNodeList.setNodeList(sortedNodeList);
    });

    #applyValue(value) {
        const oldSelectedEl = this.querySelector(`.selected`);
        if (oldSelectedEl != null) {
            oldSelectedEl.classList.remove("selected");
        }
        const newSelectedEl = this.querySelector(`[value="${value}"]`);
        if (newSelectedEl != null) {
            newSelectedEl.classList.add("selected");
        }
    }

    #onSlotChange = debounce(() => {
        this.#resolveSlottedElements();
    });

}

customElements.define("jse-input-coordinates-modal", CoordinatesInputModal);
