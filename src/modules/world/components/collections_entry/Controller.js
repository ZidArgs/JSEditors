import scope from "../../data/WorldEditorScope";
// import CollectionEntryModal from "../components/modal/CollectionEntryModal.js";

export default class Controller_Collections_Entry extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        // TODO add contextmenus
        treeEl.addEventListener("collectionEntrySelect", (event) => {
            const {ref} = event.data;
            scope.editPath = [ref];
            if (detailEditorEl != null) {
                const data = this.getConfigData(ref);
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
                    const collectionConfig = scope.config.collections[ref];
                    scope.config.collections[ref] = {
                        ...collectionConfig,
                        ...event.data
                    };
                    editorEl.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    getConfigData(ref) {
        return scope.config.collections[ref];
    }

}
