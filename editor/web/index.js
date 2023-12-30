import "/JSEditors/EditorWindow.js";
// load editor configurations
import createFormEditor from "./editors/form/FormEditor.js";

const windowElement = document.getElementById("window");

// add editors
windowElement.register(await createFormEditor());

