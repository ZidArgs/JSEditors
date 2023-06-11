import scope from "../data/WorldEditorScope.js";
// import AreaEntryModal from "../components/modal/AreaEntryModal.js";

export default class AreaEntryController {

    constructor(editorEl, treeEl, detailEditor) {
        // TODO add contextmenus
        treeEl.addEventListener("areaSelect", (event) => {
            const {ref} = event;
            const data = this.getConfigData(ref);
            editorEl.switchDetailEditor(detailEditor, data, ref);
        });
        treeEl.addEventListener("areaMenu", (/* event */) => {
            // const {ref} = event;
            // const dialogEl = new AreaEntryModal();
            // dialogEl.show();
        });
    }

    getConfigData(ref) {
        return scope.config.area[ref];
    }

}
