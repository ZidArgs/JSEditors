import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class CtxMenu_Locations extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "add", content: "Add location"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-world-ctxmenu-locations", CtxMenu_Locations);
