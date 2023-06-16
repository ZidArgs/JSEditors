import scope from "../data/WorldEditorScope";
// import AreaMapConfigModal from "../components/modal/AreaMapConfigModal.js";

export default class ControllerAreasEntryMapConfig {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("areasEntryMapConfigSelect", (event) => {
            const {area} = event.data;
            scope.editPath = [area];
            if (detailEditorEl != null) {
                const data = this.getConfigData(area);
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref] = scope.editPath;
                if (ref != null) {
                    // TODO streamline event data structure
                    scope.config.area[ref].map = event.data;
                    this.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData(ref) {
        return scope.config.area[ref].map;
    }

}
