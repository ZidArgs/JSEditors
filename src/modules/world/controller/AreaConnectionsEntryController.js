import scope from "../data/WorldEditorScope.js";
// import AreaConnectionsEntryModal from "../components/modal/AreaConnectionsEntryModal.js";

export default class AreaConnectionsEntryController {

    constructor(editorEl, treeEl, detailEditor) {
        // TODO add contextmenus
        treeEl.addEventListener("areaConnectionItemSelect", (event) => {
            const {area, index} = event;
            const data = this.getConfigData(area, index);
            editorEl.switchDetailEditor(detailEditor, data, area, null, index);
        });
        treeEl.addEventListener("areaConnectionItemMenu", (/* event */) => {
            // const {area, index} = event;
            // const dialogEl = new AreaListEntryModal();
            // dialogEl.show();
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
