import scope from "../data/WorldEditorScope.js";
// import AreaMapConfigModal from "../components/modal/AreaMapConfigModal.js";

export default class AreaMapConfigController {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("areaMapConfigSelect", (event) => {
            const {area} = event;
            const data = this.getConfigData(area);
            scope.editPath = [area];
            detailEditorEl.setData(data);
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaMapConfigMenu", (/* event */) => {
            // const {area} = event;
            // const dialogEl = new AreaMapConfigModal();
            // dialogEl.show();
        });
        /* --- */
        detailEditorEl.addEventListener("save", (event) => {
            const [ref] = scope.editPath;
            if (ref != null) {
                // TODO streamline event data structure
                scope.config.area[ref].map = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
    }

    getConfigData(ref) {
        return scope.config.area[ref].map;
    }

}
