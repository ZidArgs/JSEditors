import scope from "../data/WorldEditorScope.js";
// import AreaConnectionsEntryModal from "../components/modal/AreaConnectionsEntryModal.js";

export default class AreaConnectionsEntryController {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("areaConnectionItemSelect", (event) => {
            const {area, index} = event;
            const data = this.getConfigData(area, index);
            scope.editPath = [area, index];
            detailEditorEl.setData(data);
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaConnectionItemMenu", (/* event */) => {
            // const {area, index} = event;
            // const dialogEl = new AreaListEntryModal();
            // dialogEl.show();
        });
        /* --- */
        detailEditorEl.addEventListener("save", (event) => {
            const [ref, listIndex] = scope.editPath;
            if (ref != null && listIndex != null) {
                // TODO streamline event data structure
                scope.config.area[ref].connections[listIndex] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
    }

    getConfigData(ref, index) {
        const areaConfig = scope.config.area[ref];
        const connectionList = areaConfig.connections;
        const {label, posA, posB} = connectionList[index];
        return {
            mapConfig: areaConfig.map,
            connections: connectionList,
            list: [],
            index: index,
            entry: {
                label,
                posA,
                posB
            }
        };
    }

}
