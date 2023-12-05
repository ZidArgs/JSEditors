import scope from "../../data/WorldEditorScope";

export default class Controller_Collections_Entry_List_Item {

    constructor(editorEl, treeEl, detailEditorEl) {
        // TODO add contextmenus
        treeEl.addEventListener("collectionEntryListItemSelect", (event) => {
            const {collection, index} = event.data;
            scope.editPath = [collection, "list", index];
            if (detailEditorEl != null) {
                const data = this.getConfigData(collection, index);
                detailEditorEl.setData(data);
                detailEditorEl.setFilterConfig(scope.filterConfig);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref, listIndex] = scope.editPath;
                if (ref != null && listIndex != null) {
                    // TODO streamline event data structure
                    scope.config.collections[ref].list[listIndex] = event.data;
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
        /* --- */
        treeEl.addEventListener("collectionEntryListAddElementBefore", (event) => {
            const {collection, index, ref, type} = event.data;
            const data = scope.config.collection[collection].list;
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.splice(index, 0, newListItem);
            editorEl.reloadTreeAtPath([collection, "list"]);
            scope.editPath = [collection, "list", index];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("collectionEntryListAddElementAfter", (event) => {
            const {collection, index, ref, type} = event.data;
            const data = scope.config.collection[collection].list;
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.splice(index + 1, 0, newListItem);
            editorEl.reloadTreeAtPath([collection, "list"]);
            scope.editPath = [collection, "list", index + 1];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("collectionEntryListRemoveElement", (event) => {
            const {collection, index} = event.data;
            const data = scope.config.collection[collection].list;
            data.splice(index, 1);
            editorEl.reloadTreeAtPath([collection, "list"]);
            scope.editPath = [];
            editorEl.switchDetailEditor();
        });
    }

    getConfigData(ref, index) {
        const collectionConfig = scope.config.collections[ref];
        const locationList = collectionConfig.list;
        const {category, id, pos, visible = true} = locationList[index];
        return {
            mapConfig: collectionConfig.map,
            list: locationList,
            type: category,
            index,
            entry: { // FIXME
                category,
                id,
                pos,
                visible
            }
        };
    }

    generateItemDetail(data) {
        const {category, id, pos, visible} = data;
        return { // FIXME
            category,
            id,
            pos,
            visible
        };
    }

}
