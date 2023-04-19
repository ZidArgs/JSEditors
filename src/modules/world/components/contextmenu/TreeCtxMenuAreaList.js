import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class TreeCtxMenuTreeAreaList extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "addelementtop", content: "Add entry at top"},
            {menuAction: "addelementbottom", content: "Add entry at bottom"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-ctxmenu-edit-world-tree-area-list", TreeCtxMenuTreeAreaList);
