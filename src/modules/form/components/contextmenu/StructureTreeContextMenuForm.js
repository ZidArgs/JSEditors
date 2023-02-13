import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class StructureTreeContextMenuForm extends ContextMenu {

    initItems() {
        super.setItems([
            // {menuAction: "edit", content: "Edit"},
            // "splitter",
            {menuAction: "addelementtop", content: "Add element at top"},
            {menuAction: "addelementbottom", content: "Add element at bottom"},
            "splitter",
            {menuAction: "addbefore", content: "Add Form before"},
            {menuAction: "addafter", content: "Add Form after"},
            // "splitter",
            // {menuAction: "moveup", content: "Move up"},
            // {menuAction: "movedown", content: "Move down"},
            "splitter",
            {menuAction: "remove", content: "Remove"}
        ]);
    }

    setItems() {
        // nothing
    }

}

customElements.define("jse-ctxmenu-edit-form-tree-form", StructureTreeContextMenuForm);
