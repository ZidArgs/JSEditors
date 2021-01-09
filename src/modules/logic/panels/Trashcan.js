import DragDropMemory from "/emcJS/util/DragDropMemory.js";
import Template from "/emcJS/util/Template.js";

import LogicAbstractElement from "../../../ui/logic/AbstractElement.js";

const TPL = new Template(`
    <style>
        * {
            position: relative;
            box-sizing: border-box;
        }
        :host {
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
        }
    </style>
`);

function allowDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

function dropOnPlaceholder(event) {
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

export default class Trashcan extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(TPL.generate());
        this.ondragover = allowDrop;
        this.ondrop = dropOnPlaceholder.bind(this);
    }

}

customElements.define('jse-logic-trashcan', Trashcan);
