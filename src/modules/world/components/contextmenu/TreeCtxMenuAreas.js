import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class TreeCtxMenuAreas extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "add", content: "Add area"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-ctxmenu-edit-world-tree-areas", TreeCtxMenuAreas);
