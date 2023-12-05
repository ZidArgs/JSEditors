import AbstractMarker from "./AbstractMarker.js";
import STYLE from "./ConnectionMarker.js.css" assert {type: "css"};

export default class ConnectionMarker extends AbstractMarker {

    constructor() {
        super();
        STYLE.apply(this.shadowRoot);
        /* --- */
    }

}

customElements.define("jse-world-editor-input-position-marker-connection", ConnectionMarker);
