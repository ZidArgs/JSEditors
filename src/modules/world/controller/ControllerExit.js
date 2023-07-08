import scope from "../data/WorldEditorScope";

export default class ControllerExit extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("exitSelect", () => {
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
                const areaConfig = scope.config.area;
                scope.config.area = {
                    ...areaConfig,
                    ...event.data
                };
                editorEl.dispatchEvent(new Event("change"));
            });
        }
    }

    getConfigData() {
        return scope.config.area;
    }

}
