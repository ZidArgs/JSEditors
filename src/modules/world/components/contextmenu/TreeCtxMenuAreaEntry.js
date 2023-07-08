import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class TreeCtxMenuAreaEntry extends ContextMenu {

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

customElements.define("jse-ctxmenu-edit-world-tree-area-entry", TreeCtxMenuAreaEntry);
