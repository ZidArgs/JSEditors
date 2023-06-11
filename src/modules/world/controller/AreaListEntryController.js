import scope from "../data/WorldEditorScope.js";
import AreaListEntryModal from "../components/modal/AreaListEntryModal.js";

export default class AreaListEntryController {

    constructor(editorEl, treeEl, detailEditor) {
        // TODO add contextmenus
        treeEl.addEventListener("areaListItemSelect", (event) => {
            const {area, list, index} = event;
            const data = this.getConfigData(area, list, index);
            editorEl.switchDetailEditor(detailEditor, data, area, list, index);
        });
        treeEl.addEventListener("areaListItemMenu", (/* event */) => {
            // const {area, list, index} = event;
            const dialogEl = new AreaListEntryModal();
            dialogEl.show();
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
