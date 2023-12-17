import scope from "../../data/WorldEditorScope";
// import "./EditorForm.js";
import "./TreeNode.js";

export default class Controller_Exits extends EventTarget {

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
                const areaConfig = scope.config.exits;
                scope.config.exits = {
                    ...areaConfig,
                    ...event.data
                };
                editorEl.dispatchEvent(new Event("change"));
            });
        }
    }

    getConfigData() {
        return scope.config.exits;
    }

}
