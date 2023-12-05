import scope from "../../data/WorldEditorScope";

export default class Controller_Locations extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("locationSelect", () => {
            scope.editPath = [];
            if (detailEditorEl != null) {
                const data = this.getConfigData();
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const areaConfig = scope.config.locations;
                scope.config.locations = {
                    ...areaConfig,
                    ...event.data
                };
                editorEl.dispatchEvent(new Event("change"));
            });
        }
    }

    getConfigData() {
        return scope.config.locations;
    }

}
