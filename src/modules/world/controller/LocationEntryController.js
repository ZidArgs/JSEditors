import scope from "../data/WorldEditorScope.js";
// import LocationEntryModal from "../components/modal/LocationEntryModal.js";

export default class LocationEntryController {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("locationSelect", (event) => {
            const {ref} = event;
            const data = this.getConfigData(ref);
            scope.editPath = [ref];
            detailEditorEl.setData(data);
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("locationMenu", (/* event */) => {
            // const {ref} = event;
            // const dialogEl = new LocationEntryModal();
            // dialogEl.show();
        });
        /* --- */
        detailEditorEl.addEventListener("save", (event) => {
            const [ref] = scope.editPath;
            if (ref != null) {
                // TODO streamline event data structure
                scope.config.location[ref] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
    }

    getConfigData(ref) {
        return scope.config.location[ref];
    }

}
