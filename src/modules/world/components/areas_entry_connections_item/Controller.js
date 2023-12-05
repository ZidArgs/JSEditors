import scope from "../../data/WorldEditorScope";
// import AreaConnectionsEntryModal from "../components/modal/AreaConnectionsEntryModal.js";

export default class Controller_Areas_Entry_Connections_Item {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("areaEntryConnectionsItemSelect", (event) => {
            const {area, index} = event.data;
            scope.editPath = [area, index];
            if (detailEditorEl != null) {
                const data = this.getConfigData(area, index);
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref, listIndex] = scope.editPath;
                if (ref != null && listIndex != null) {
                    // TODO streamline event data structure
                    scope.config.area[ref].connections[listIndex] = event.data;
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData(ref, index) {
        const areaConfig = scope.config.areas[ref];
        const connectionList = areaConfig.connections;
        const {label, posA, posB} = connectionList[index];
        return {
            mapConfig: areaConfig.map,
            connections: connectionList,
            lists: areaConfig.lists,
            index: index,
            entry: {
                label,
                posA,
                posB
            }
        };
    }

}
