import CustomElement from "/emcJS/ui/element/CustomElement.js";
import FormBuilder from "/emcJS/util/form/FormBuilder.js";
import FormContext from "/emcJS/util/form/FormContext.js";
import "/emcJS/ui/form/field/DefaultFormFieldsLoader.js";
import "../components/field/PositionInput.js";
import TPL from "./AreaListEntryDetailEditor.js.html" assert {type: "html"};
import STYLE from "./AreaListEntryDetailEditor.js.css" assert {type: "css"};
import FORM_CONFIG from "./AreaListEntryDetailEditor.js.json" assert {type: "json"};

export default class AreaListEntryDetailEditor extends CustomElement {

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
        /* --- */
        const posInputEl = this.shadowRoot.getElementById("pos-input");
        posInputEl.loadData({
            "active": true,
            "color": "black",
            "background": "/images/maps/dungeon/deku.png",
            "width": 1920,
            "height": 1031,
            "zoom": 50
        }, {
            "A": [
                {
                    "x": 898,
                    "y": 683
                },
                {
                    "x": 506,
                    "y": 474
                }
            ],
            "B": [
                {
                    "x": 500,
                    "y": 635
                },
                {
                    "x": 535,
                    "y": 328
                }
            ],
            "C": [
                {
                    "x": 817,
                    "y": 744
                },
                {
                    "x": 1300,
                    "y": 218
                }
            ],
            "D": [
                {
                    "x": 1160,
                    "y": 221
                },
                {
                    "x": 1779,
                    "y": 918
                }
            ]
        }, [
            {
                "id": "deku_kokiri_gateway -> kokiri_deku_gateway",
                "pos": {
                    "x": 817,
                    "y": 936
                },
                "type": "exit"
            },
            {
                "id": "kokiri",
                "pos": {
                    "x": 817,
                    "y": 936
                },
                "type": "area",
                "visible": {
                    "type": "state",
                    "el": "option[shuffle_dungeons]",
                    "value": "shuffle_dungeons_off"
                }
            },
            {
                "id": "deku.c_lobby",
                "pos": {
                    "x": 509,
                    "y": 591
                },
                "type": "location"
            },
            {
                "id": "deku.c_slingshot",
                "pos": {
                    "x": 70,
                    "y": 882
                },
                "type": "location"
            }
        ], "location", 0)
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
        this.#formContext.loadData(data);
    }

    getData() {
        return this.#formContext.getData();
    }

}

customElements.define("jse-world-editor-detail-area-list-entry", AreaListEntryDetailEditor);
