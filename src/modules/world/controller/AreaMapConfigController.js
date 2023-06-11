import scope from "../data/WorldEditorScope.js";
// import AreaMapConfigModal from "../components/modal/AreaMapConfigModal.js";

export default class AreaMapConfigController {

    constructor(editorEl, treeEl, detailEditor) {
        // TODO add contextmenus
        treeEl.addEventListener("areaMapConfigSelect", (event) => {
            const {area} = event;
            const data = this.getConfigData(area);
            editorEl.switchDetailEditor(detailEditor, data, area);
        });
        treeEl.addEventListener("areaMapConfigMenu", (/* event */) => {
            // const {area} = event;
            // const dialogEl = new AreaMapConfigModal();
            // dialogEl.show();
        });
    }

    getConfigData(ref) {
        return scope.config.area[ref].map;
    }

}
