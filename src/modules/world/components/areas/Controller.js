import scope from "../../data/WorldEditorScope.js";
// import "./EditorForm.js";
import "./TreeNode.js";

export default class Controller_Areas extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("select_Areas", () => {
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
                const areaConfig = scope.config.areas;
                scope.config.areas = {
                    ...areaConfig,
                    ...event.data
                };
                editorEl.dispatchEvent(new Event("change"));
            });
        }
    }

    getConfigData() {
        return scope.config.areas;
    }

}
