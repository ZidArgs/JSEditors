import scope from "../data/WorldEditorScope";
// import AreaEntryModal from "../components/modal/AreaEntryModal.js";

export default class ControllerAreasEntryList extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        // TODO add contextmenus
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
                    // TODO streamline event data structure
                    const areaConfig = scope.config.area[ref];
                    scope.config.area[ref] = {
                        ...areaConfig,
                        ...event.data
                    };
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
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

}
