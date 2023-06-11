import scope from "../data/WorldEditorScope.js";
// import LocationEntryModal from "../components/modal/LocationEntryModal.js";

export default class LocationEntryController {

    constructor(editorEl, treeEl, detailEditor) {
        // TODO add contextmenus
        treeEl.addEventListener("locationSelect", (event) => {
            const {ref} = event;
            const data = this.getConfigData(ref);
            editorEl.switchDetailEditor(detailEditor, data, ref);
        });
        treeEl.addEventListener("locationMenu", (/* event */) => {
            // const {ref} = event;
            // const dialogEl = new LocationEntryModal();
            // dialogEl.show();
        });
    }

    getConfigData(ref) {
        return scope.config.location[ref];
    }

}
