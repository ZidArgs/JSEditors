import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class TreeCtxMenuAreasEntryConnections extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "add", content: "Add connection"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-ctxmenu-edit-world-tree-area-connections", TreeCtxMenuAreasEntryConnections);
