import "./src/EditorWindow.js";

import "./src/modules/logic/Editor.js";
import "./src/modules/properties/Editor.js";

const windowElement = document.getElementById("window");

// add logic editor
(function() {
    const editor = document.createElement("jse-logic-editor");
    windowElement.register("Logic", editor);
})();

// add properties editor
(function() {
    const editor = document.createElement("jse-properties-editor");
    editor.setDetailConfig({
        "type": {
            "title": "Type",
            "type": "choice",
            "values": ["", "area", "chest", "skulltula", "scrub", "gossipstone", "cow", "bean"]
        },
        "access": {
            "title": "Logic reference",
            "type": "select",
            "values": ["foobar", "bar", "foo", "lorem", "remember", "tea", "test"]
        },
        "visible": {
            "title": "Visibility logic",
            "type": "logic",
            "operators": [{
                "type": "group",
                "caption": "default",
                "children": [{"type": "jse-logic-true"}, {"type": "jse-logic-false"}]
            }]
        }
    });
    windowElement.register("Properties", editor);
})();
