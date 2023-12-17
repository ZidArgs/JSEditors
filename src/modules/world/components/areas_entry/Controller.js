import scope from "../../data/WorldEditorScope";
// import AreaEntryModal from "../components/modal/AreaEntryModal.js";
import "./EditorForm.js";
import "./TreeNode.js";

export default class Controller_Areas_Entry extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        // TODO add contextmenus
        treeEl.addEventListener("select_Areas_Entry", (event) => {
            const {ref} = event.data;
            scope.editPath = [ref];
            if (detailEditorEl != null) {
                const data = this.getConfigData(ref);
                detailEditorEl.setName(ref);
                detailEditorEl.setData(data);
                detailEditorEl.setFilterConfig(scope.filterConfig);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const [ref] = scope.editPath;
                if (ref != null) {
                    // TODO streamline event data structure
                    const areaConfig = scope.config.areas[ref];
                    scope.config.areas[ref] = {
                        ...areaConfig,
                        ...event.data
                    };
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData(ref) {
        return scope.config.areas[ref];
    }

}
