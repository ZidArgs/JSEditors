import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class CtxMenu_Collections_Entry extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "copyName", content: "Copy name to clipboard"},
            {menuAction: "delete", content: "Delete"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-world-ctxmenu-collections-entry", CtxMenu_Collections_Entry);
