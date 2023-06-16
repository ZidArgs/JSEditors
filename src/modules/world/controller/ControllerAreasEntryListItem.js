import scope from "../data/WorldEditorScope";

export default class ControllerAreasEntryListItem {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("areasEntryListItemSelect", (event) => {
            const {area, list, index} = event.data;
            scope.editPath = [area, list, index];
            if (detailEditorEl != null) {
                const data = this.getConfigData(area, list, index);
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref, listName, listIndex] = scope.editPath;
                if (ref != null && listName != null && listIndex != null) {
                    // TODO streamline event data structure
                    scope.config.area[ref][listName][listIndex] = event.data;
                    this.dispatchEvent(new Event("change"));
                }
            });
        }
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
