import scope from "../data/WorldEditorScope";
// import CollectionEntryModal from "../components/modal/CollectionEntryModal.js";

export default class ControllerAreaCollectionList extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("collectionEntryListSelect", (event) => {
            const {collection, list} = event.data;
            scope.editPath = [collection, list];
            if (detailEditorEl != null) {
                const data = this.getConfigData(collection, list);
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref] = scope.editPath;
                if (ref != null) {
                    const collectionConfig = scope.config.collection[ref];
                    const listItem = this.generateItemDetail(event.data);
                    scope.config.collection[ref] = {
                        ...collectionConfig,
                        ...listItem
                    };
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
        /* --- */
        treeEl.addEventListener("collectionListAddElementTop", (event) => {
            const {collection, list, ref, type} = event.data;
            const data = scope.config.collection[collection][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.unshift(newListItem);
            editorEl.reloadTree();
            scope.editPath = [collection, list, 0];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("collectionListAddElementBottom", (event) => {
            const {collection, list, ref, type} = event.data;
            const data = scope.config.collection[collection][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.push(newListItem);
            editorEl.reloadTree();
            scope.editPath = [collection, list, data.length - 1];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
    }

    getConfigData(ref, listName) {
        const collectionConfig = scope.config.collection[ref];
        const locationList = collectionConfig[listName];
        return {
            mapConfig: collectionConfig.map,
            connections: collectionConfig.connections,
            list: locationList
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
