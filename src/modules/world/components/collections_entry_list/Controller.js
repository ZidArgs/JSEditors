import scope from "../../data/WorldEditorScope";
// import CollectionEntryModal from "../components/modal/CollectionEntryModal.js";

export default class Controller_Collections_Entry_List extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("collectionEntryListSelect", (event) => {
            const {collection} = event.data;
            scope.editPath = [collection, "list"];
            if (detailEditorEl != null) {
                const data = this.getConfigData(collection);
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref] = scope.editPath;
                if (ref != null) {
                    const collectionList = scope.config.collections[ref].list;
                    const listItem = this.generateItemDetail(event.data);
                    scope.config.collections[ref].list = [
                        ...collectionList,
                        ...listItem
                    ];
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
        /* --- */
        treeEl.addEventListener("collectionListAddElementTop", (event) => {
            const {collection, ref, type} = event.data;
            const data = scope.config.collections[collection].list;
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.unshift(newListItem);
            editorEl.reloadTreeAtPath([collection, "list"]);
            scope.editPath = [collection, "list", 0];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("collectionListAddElementBottom", (event) => {
            const {collection, ref, type} = event.data;
            const data = scope.config.collections[collection].list;
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.push(newListItem);
            editorEl.reloadTreeAtPath([collection, "list"]);
            scope.editPath = [collection, "list", data.length - 1];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
    }

    getConfigData(ref) {
        const collectionConfig = scope.config.collections[ref];
        const locationList = collectionConfig.list;
        return {
            mapConfig: collectionConfig.map,
            list: locationList
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
