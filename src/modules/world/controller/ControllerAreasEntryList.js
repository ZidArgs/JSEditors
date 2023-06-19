import scope from "../data/WorldEditorScope";
// import AreaEntryModal from "../components/modal/AreaEntryModal.js";

export default class ControllerAreasEntryList extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("areasEntryListSelect", (event) => {
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
                    const areaConfig = scope.config.area[ref];
                    const listItem = this.generateItemDetail(event.data);
                    scope.config.area[ref] = {
                        ...areaConfig,
                        ...listItem
                    };
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
        /* --- */
        treeEl.addEventListener("areaListAddElementTop", (event) => {
            const {area, list, ref, type} = event.data;
            const data = scope.config.area[area][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.unshift(newListItem);
            editorEl.reloadTree();
            scope.editPath = [area, list, 0];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        treeEl.addEventListener("areaListAddElementBottom", (event) => {
            const {area, list, ref, type} = event.data;
            const data = scope.config.area[area][list];
            const newListItem = this.generateItemDetail({
                category: type,
                id: ref
            });
            data.push(newListItem);
            editorEl.reloadTree();
            scope.editPath = [area, list, data.length - 1];
            if (detailEditorEl != null) {
                detailEditorEl.setData(newListItem);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
    }

    getConfigData(ref, listName) {
        const areaConfig = scope.config.area[ref];
        const locationList = areaConfig[listName];
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
