import scope from "../data/WorldEditorScope";

export default class ControllerCollectionEntryListItem {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("collectionEntryListItemSelect", (event) => {
            const {collection, list, index} = event.data;
            scope.editPath = [collection, list, index];
            if (detailEditorEl != null) {
                const data = this.getConfigData(collection, list, index);
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
                    scope.config.collection[ref][listName][listIndex] = event.data;
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
        /* --- */
        treeEl.addEventListener("collectionEntryListAddElementBefore", (event) => {
            const {collection, list, index, ref, type} = event.data;
            const data = scope.config.collection[collection][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.splice(index, 0, newListItem);
            editorEl.reloadTree();
            scope.editPath = [collection, list, index];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("collectionEntryListAddElementAfter", (event) => {
            const {collection, list, index, ref, type} = event.data;
            const data = scope.config.collection[collection][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.splice(index + 1, 0, newListItem);
            editorEl.reloadTree();
            scope.editPath = [collection, list, index + 1];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("collectionEntryListRemoveElement", (event) => {
            const {collection, list, index} = event.data;
            const data = scope.config.collection[collection][list];
            data.splice(index, 1);
            editorEl.reloadTree();
            scope.editPath = [];
            editorEl.switchDetailEditor();
        });
    }

    getConfigData(ref, listName, index) {
        const collectionConfig = scope.config.collection[ref];
        const locationList = collectionConfig[listName];
        const {category, id, pos, visible = true} = locationList[index];
        return {
            mapConfig: collectionConfig.map,
            connections: collectionConfig.connections,
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
