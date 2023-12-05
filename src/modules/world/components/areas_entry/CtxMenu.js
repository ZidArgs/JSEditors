import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class CtxMenu_Areas_Entry extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "edit", content: "Edit"},
            "splitter",
            {menuAction: "remove", content: "Remove"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-world-ctxmenu-areas-entry", CtxMenu_Areas_Entry);
