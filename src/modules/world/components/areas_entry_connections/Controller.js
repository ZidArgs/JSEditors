import scope from "../../data/WorldEditorScope.js";

export default class Controller_Areas_Entry_Connections extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        // TODO add contextmenus
        treeEl.addEventListener("areaEntryConnectionsSelect", (event) => {
            const {area, index} = event.data;
            scope.editPath = [area, index];
            if (detailEditorEl != null) {
                const data = this.getConfigData(area, index);
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref, listIndex] = scope.editPath;
                if (ref != null && listIndex != null) {
                    // TODO streamline event data structure
                    scope.config.areas[ref].connections[listIndex] = event.data;
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData() {
        return scope.config.areas;
    }

}
