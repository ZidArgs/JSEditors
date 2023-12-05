import scope from "../../data/WorldEditorScope";
// import AreaEntryModal from "../components/modal/AreaEntryModal.js";

// TODO

export default class Controller_Areas_Entry_Lists extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("areaEntryListSelect", (event) => {
            const {area, list} = event.data;
            scope.editPath = [area, list];
            if (detailEditorEl != null) {
                const data = this.getConfigData(area, list);
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref] = scope.editPath;
                if (ref != null) {
                    const areaLists = scope.config.areas[ref].lists;
                    const listItem = this.generateItemDetail(event.data);
                    scope.config.areas[ref].lists = {
                        ...areaLists,
                        ...listItem
                    };
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
        /* --- */
        treeEl.addEventListener("areaListAddElementTop", (event) => {
            const {area, list, ref, type} = event.data;
            const data = scope.config.areas[area].lists[list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.unshift(newListItem);
            editorEl.reloadTreeAtPath([area, list]);
            scope.editPath = [area, list, 0];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaListAddElementBottom", (event) => {
            const {area, list, ref, type} = event.data;
            const data = scope.config.areas[area].lists[list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.push(newListItem);
            editorEl.reloadTreeAtPath([area, list]);
            scope.editPath = [area, list, data.length - 1];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
    }

    getConfigData(ref, listName) {
        const areaConfig = scope.config.areas[ref];
        const locationList = areaConfig.lists[listName];
        return {
            mapConfig: areaConfig.map,
            connections: areaConfig.connections,
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
