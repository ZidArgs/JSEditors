import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class CtxMenu_Exits extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "add", content: "Add exit"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-world-ctxmenu-exits", CtxMenu_Exits);
