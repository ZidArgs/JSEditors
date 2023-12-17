import scope from "../../data/WorldEditorScope";
// import LocationEntryModal from "../components/modal/LocationEntryModal.js";
import "./EditorForm.js";
import "./TreeNode.js";

export default class Controller_Locations_Entry {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("locationEntrySelect", (event) => {
            const {ref} = event.data;
            scope.editPath = [ref];
            if (detailEditorEl != null) {
                const data = this.getConfigData(ref);
                detailEditorEl.setName(ref);
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
                    scope.config.locations[ref] = event.data;
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData(ref) {
        return scope.config.locations[ref];
    }

}
