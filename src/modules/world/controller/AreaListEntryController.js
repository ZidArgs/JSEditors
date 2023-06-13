import scope from "../data/WorldEditorScope.js";
import AreaListEntryModal from "../components/modal/AreaListEntryModal.js";

export default class AreaListEntryController {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("areaListItemSelect", (event) => {
            const {area, list, index} = event;
            const data = this.getConfigData(area, list, index);
            scope.editPath = [area, list, index];
            detailEditorEl.setData(data);
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaListItemMenu", (/* event */) => {
            // const {area, list, index} = event;
            const dialogEl = new AreaListEntryModal();
            dialogEl.show();
        });
        /* --- */
        detailEditorEl.addEventListener("save", (event) => {
            const [ref, listName, listIndex] = scope.editPath;
            if (ref != null && listName != null && listIndex != null) {
                // TODO streamline event data structure
                scope.config.area[ref][listName][listIndex] = event.data;
                this.dispatchEvent(new Event("change"));
            }
        });
    }

    getConfigData(ref, listName, index) {
        const areaConfig = scope.config.area[ref];
        const locationList = areaConfig[listName];
        const {category, id, pos, visible = true} = locationList[index];
        return {
            mapConfig: areaConfig.map,
            connections: areaConfig.connections,
            list: locationList,
            type: category,
            index,
            entry: {
                category,
                id,
                pos,
                visible
            }
        };
    }

}
