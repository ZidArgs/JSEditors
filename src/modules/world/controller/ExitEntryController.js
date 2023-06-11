import scope from "../data/WorldEditorScope.js";
// import ExitEntryModal from "../components/modal/ExitEntryModal.js";

export default class ExitEntryController {

    constructor(editorEl, treeEl, detailEditor) {
        // TODO add contextmenus
        treeEl.addEventListener("exitSelect", (event) => {
            const {ref} = event;
            const data = this.getConfigData(ref);
            editorEl.switchDetailEditor(detailEditor, data, ref);
        });
        treeEl.addEventListener("exitMenu", (/* event */) => {
            // const {ref} = event;
            // const dialogEl = new ExitEntryModal();
            // dialogEl.show();
        });
    }

    getConfigData(ref) {
        return scope.config.exit[ref];
    }

}
