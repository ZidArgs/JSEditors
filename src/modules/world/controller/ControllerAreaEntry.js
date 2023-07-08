import scope from "../data/WorldEditorScope";
// import AreaEntryModal from "../components/modal/AreaEntryModal.js";

export default class ControllerAreaEntry extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        // TODO add contextmenus
        treeEl.addEventListener("areaEntrySelect", (event) => {
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

    getConfigData(ref) {
        return scope.config.area[ref];
    }

}
