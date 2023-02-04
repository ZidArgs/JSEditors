import "/JSEditors/EditorWindow.js";
// load editor configurations
import createFormEditor from "./editors/FormEditor.js";

const windowElement = document.getElementById("window");

function registerWindow({name, panel, navigation, refreshFn}) {
    windowElement.register(name, panel, navigation, refreshFn);
}

// add editors
registerWindow(await createFormEditor());

