import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class CtxMenu_Areas_Entry_Lists_List extends ContextMenu {

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

customElements.define("jse-world-ctxmenu-areas-lists-list", CtxMenu_Areas_Entry_Lists_List);
