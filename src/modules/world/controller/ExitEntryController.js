import scope from "../data/WorldEditorScope.js";
// import ExitEntryModal from "../components/modal/ExitEntryModal.js";

export default class ExitEntryController {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("exitSelect", (event) => {
            const {ref} = event;
            const data = this.getConfigData(ref);
            scope.editPath = [ref];
            detailEditorEl.setData(data);
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("exitMenu", (/* event */) => {
            // const {ref} = event;
            // const dialogEl = new ExitEntryModal();
            // dialogEl.show();
        });
        /* --- */
        detailEditorEl.addEventListener("save", (event) => {
            const [ref] = scope.editPath;
            if (ref != null) {
                // TODO streamline event data structure
                scope.config.exit[ref] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
    }

    getConfigData(ref) {
        return scope.config.exit[ref];
    }

}
