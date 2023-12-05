import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class CtxMenu_Areas_Entry_Lists_List_Item extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "edit", content: "Edit"},
            // "splitter",
            // {menuAction: "moveup", content: "Move entry up"},
            // {menuAction: "movedown", content: "Move entry down"},
            "splitter",
            {menuAction: "addbefore", content: "Add entry before"},
            {menuAction: "addafter", content: "Add entry after"},
            "splitter",
            {menuAction: "remove", content: "Remove"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-world-ctxmenu-areas-lists-list-item", CtxMenu_Areas_Entry_Lists_List_Item);
