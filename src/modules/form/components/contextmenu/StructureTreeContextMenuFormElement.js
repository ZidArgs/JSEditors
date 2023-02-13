import ContextMenu from "/emcJS/ui/overlay/ctxmenu/ContextMenu.js";

export default class StructureTreeContextMenuFormElement extends ContextMenu {

    initItems() {
        super.setItems([
            {menuAction: "edit", content: "Edit"},
            "splitter",
            {menuAction: "addbefore", content: "Add before"},
            {menuAction: "addafter", content: "Add after"},
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

customElements.define("jse-ctxmenu-edit-form-tree-form-element", StructureTreeContextMenuFormElement);
