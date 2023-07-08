import scope from "../data/WorldEditorScope";
// import LocationEntryModal from "../components/modal/LocationEntryModal.js";

export default class ControllerLocationEntry {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("locationEntrySelect", (event) => {
            const {ref} = event.data;
            scope.editPath = [ref];
            if (detailEditorEl != null) {
                const data = this.getConfigData(ref);
                detailEditorEl.setData(data);
                detailEditorEl.setFilterConfig(scope.filterConfig);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref] = scope.editPath;
                if (ref != null) {
                    // TODO streamline event data structure
                    scope.config.location[ref] = event.data;
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData(ref) {
        return scope.config.location[ref];
    }

}
