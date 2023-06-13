import scope from "../data/WorldEditorScope.js";
// import AreaEntryModal from "../components/modal/AreaEntryModal.js";

export default class AreaEntryController {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("areaSelect", (event) => {
            const {ref} = event;
            const data = this.getConfigData(ref);
            scope.editPath = [ref];
            detailEditorEl.setData(data);
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaMenu", (/* event */) => {
            // const {ref} = event;
            // const dialogEl = new AreaEntryModal();
            // dialogEl.show();
        });
        /* --- */
        detailEditorEl.addEventListener("save", (event) => {
            const [ref] = scope.editPath;
            if (ref != null) {
                // TODO streamline event data structure
                const areaConfig = scope.config.area[ref];
                scope.config.area[ref] = {
                    ...areaConfig,
                    ...event.data
                };
                editorEl.dispatchEvent(new Event("change"));
            }
        });
    }

    getConfigData(ref) {
        return scope.config.area[ref];
    }

}
