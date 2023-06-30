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
                detailEditorEl.setFilterConfig(scope.filterConfig);
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
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
        /* --- */
        treeEl.addEventListener("areaListAddElementBefore", (event) => {
            const {area, list, index, ref, type} = event.data;
            const data = scope.config.area[area][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.splice(index, 0, newListItem);
            editorEl.reloadTree();
            scope.editPath = [area, list, index];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaListAddElementAfter", (event) => {
            const {area, list, index, ref, type} = event.data;
            const data = scope.config.area[area][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.splice(index + 1, 0, newListItem);
            editorEl.reloadTree();
            scope.editPath = [area, list, index + 1];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaListRemoveElement", (event) => {
            const {area, list, index} = event.data;
            const data = scope.config.area[area][list];
            data.splice(index, 1);
            editorEl.reloadTree();
            scope.editPath = [];
            editorEl.switchDetailEditor();
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

    generateItemDetail(data) {
        const {category, id, pos, visible} = data;
        return {
            category,
            id,
            pos,
            visible
        };
    }

}
