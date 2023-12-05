import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class CtxMenu_Areas_Entry_Connections extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "add", content: "Add connection"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-world-ctxmenu-areas-connections", CtxMenu_Areas_Entry_Connections);
