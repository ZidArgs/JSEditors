import "/JSEditors/EditorWindow.js";
// load editor configurations
// import createFormEditor from "./editors/form/FormEditor.js";
import createWorldEditor from "./editors/world/WorldEditor.js";

const windowElement = document.getElementById("window");

// add editors
// windowElement.register(await createFormEditor());
windowElement.register(await createWorldEditor());

