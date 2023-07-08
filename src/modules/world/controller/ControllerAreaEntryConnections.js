import scope from "../data/WorldEditorScope";

export default class ControllerAreaEntryConnections extends EventTarget {

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
                    scope.config.area[ref].connections[listIndex] = event.data;
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData() {
        return scope.config.area;
    }

}
