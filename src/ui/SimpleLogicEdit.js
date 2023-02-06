import Template from "/emcJS/util/html/Template.js";
import DragDropMemory from "/emcJS/util/DragDropMemory.js";
import "/emcJS/ui/container/CollapsePanel.js";
import "/emcJS/ui/FilteredList.js";

import LogicAbstractElement from "./logic/AbstractElement.js";
import "./logic/ComparatorEqual.js";
import "./logic/ComparatorGreaterThan.js";
import "./logic/ComparatorGreaterThanEqual.js";
import "./logic/ComparatorLessThan.js";
import "./logic/ComparatorLessThanEqual.js";
import "./logic/ComparatorNotEqual.js";
import "./logic/LiteralFalse.js";
// import "./logic/LiteralNumber.js";
import "./logic/LiteralPointer.js";
import "./logic/LiteralState.js";
// import "./logic/LiteralString.js";
import "./logic/LiteralTrue.js";
import "./logic/LiteralValue.js";
import "./logic/MathAdd.js";
import "./logic/MathDiv.js";
import "./logic/MathMod.js";
import "./logic/MathMul.js";
import "./logic/MathPow.js";
import "./logic/MathSub.js";
import "./logic/OperatorAnd.js";
import "./logic/OperatorMax.js";
import "./logic/OperatorMin.js";
import "./logic/OperatorNand.js";
import "./logic/OperatorNor.js";
import "./logic/OperatorNot.js";
import "./logic/OperatorOr.js";
import "./logic/OperatorXnor.js";
import "./logic/OperatorXor.js";

const TPL = new Template(`
<style>
    :host {
        display: grid;
        height: 500px;
        padding: 5px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        background-color: #111;
        grid-template-columns: 2fr 2fr;
        grid-template-rows: 1fr 50px;
        grid-template-areas: 
        "workingarea elements"
        "trashcan elements";
        grid-column-gap: 5px;
        grid-row-gap: 5px;
    }
    #workingarea {
        display: block;
        border: solid 2px;
        border-color: #777;
        grid-area: workingarea;
    }
    #trashcan {
        display: block;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        border: solid 2px;
        border-color: #777;
        background-color: #222;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB3aWR0aD0iMTAwMCIgICBoZWlnaHQ9IjEwMDAiICAgdmlld0JveD0iMCAwIDI2NC41ODMzMyAyNjQuNTgzMzQiICAgdmVyc2lvbj0iMS4xIj4gIDxnICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC0zMi40MTY2NSkiPiAgICA8cGF0aCAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2M1YzVjNTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6My40NjEyNTYwMztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgICAgICAgZD0iTSAxMDUuODgwNzQsNDEuMTA0MDkgViA1My43MTUyMzIgSCAxOC4xMjk5NDYgViA4Mi45NjEzODMgSCAyNDYuNDYzNDYgViA1My43MTUyMzIgSCAxNTguNzEyNjggViA0MS4xMDQwOSBaIE0gMzAuNjQzNDc4LDg1Ljc4NTkyOSAzMS45MzQ0ODksMTA1LjA0NzQ4IEggNy4xOTY2MTc0IHYgMTkuMjYyNzYgSCAzMy4yMjQ5NDIgbCAxMC45OTAzODQsMTY0LjAwMjMgSCAyMjAuMzc4MDggbCAxMC45OTAzOSwtMTY0LjAwMjMgaCAyNi4wMTgyNSB2IC0xOS4yNjI3NiBoIC0yNC43Mjc4IGwgMS4yOTEwMSwtMTkuMjYxNTUxIHogTSA0My45Mzk1NiwxMDUuMDQ3NDggSCA1Ny43ODY2MTYgTCA3MS4zNTg0NjgsMjcwLjY1NzY1IEggNTcuNTEwODUxIFogbSA0MC43MTQ0MjksMCBoIDEzLjg0NzA1OCBsIDYuNzg1MDgzLDE2NS42MTAxNyBIIDkxLjQzOTYzNSBaIG0gNDAuOTg5NjQxLDAgaCAxMy44NDY1IHYgMTY1LjYxMDE3IGggLTEzLjg0NjUgeiBtIDQwLjQzOTIyLDAgaCAxMy44NDcwNSBsIC02Ljc4NTYzLDE2NS42MTAxNyBoIC0xMy44NDc2MyB6IG0gNDAuNzE0NDMsMCBoIDEzLjg0NjUgbCAtMTMuNTcxMjksMTY1LjYxMDE3IGggLTEzLjg0NzA2IHoiLz4gIDwvZz48L3N2Zz4=);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        grid-area: trashcan;
    }
    #elements {
        box-sizing: border-box;
        border: solid 2px;
        border-top: none;
        border-color: #777;
        height: 100%;
        --list-color-back: #000;
        --list-color-border: #777;
        --list-color-hover: #000;
        --list-color-front: #fff;
        grid-area: elements;
    }
    .placeholder {
        display: table;
        margin: 5px;
        padding: 5px 20px;
        color: black;
        background-color: lightgray;
        border: 1px solid gray;
        font-weight: bold;
    }
</style>
<div id="workingarea">
    <slot id="child">
        <span id="droptarget" class="placeholder">...</span>
    </slot>
</div>
<div id="trashcan"></div>
<emc-filteredlist id="elements"></emc-filteredlist>
`);

function allowDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

function setOperators(config, container) {
    for (const item of config) {
        if (item.type === "group") {
            const cnt = document.createElement("emc-collapsepanel");
            cnt.caption = item.caption;
            setOperators(item.children, cnt);
            container.append(cnt);
        } else {
            const el = document.createElement(item.type);
            el.ref = item.ref;
            if (item["value"] != null) {
                el.value = item.value;
            }
            el.category = item.category;
            el.template = "true";
            el.dataset.filtervalue = el.ref;
            container.append(el);
        }
    }
}

class Editor extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.append(TPL.generate());
        const trashcan = this.shadowRoot.getElementById("trashcan");
        trashcan.ondragover = allowDrop;
        trashcan.ondrop = (event) => {
            this.#dropOnTrash(event);
        };
        const target = this.shadowRoot.getElementById("droptarget");
        target.ondragover = allowDrop;
        target.ondrop = (event) => {
            this.#dropOnPlaceholder(event);
        };
    }

    setOperators(config) {
        const container = this.shadowRoot.getElementById("elements");
        container.innerHTML = "";
        setOperators(config, container);
    }

    setLogic(logic) {
        if (this.children.length) {
            this.removeChild(this.children[0]);
        }
        if (logic != null) {
            this.append(LogicAbstractElement.buildLogic(logic));
        }
    }

    getLogic() {
        const el = this.children[0];
        if (el) {
            return el.toJSON();
        }
    }

    #dropOnTrash(event) {
        const els = DragDropMemory.get();
        if (els.length) {
            const el = els[0];
            if (!!el && el instanceof LogicAbstractElement && (typeof el.template != "string" || el.template == "false")) {
                el.parentElement.removeChild(el);
            }
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    #dropOnPlaceholder(event) {
        const els = DragDropMemory.get();
        if (els.length) {
            const el = els[0];
            if (el) {
                const ne = event.target.getRootNode().host.append(el.getElement(event.ctrlKey));
                if (ne) {
                    ne.removeAttribute("slot");
                }
            }
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

}

customElements.define("jse-simplelogiceditor", Editor);
