import FileSystem from "/emcJS/util/file/FileSystem.js";
import "/JSEditors/modules/world/WorldEditor.js";

export default async function() {
    const editorEl = document.createElement("jse-world-editor");

    // navigation
    const NAV = [{
        "content": "FILE",
        "submenu": [{
            "content": "SAVE",
            "handler": async () => {
                const config = editorEl.getConfig();
                FileSystem.save(JSON.stringify(config, " ", 4), `world_${(new Date()).getTime()}.json`);
            }
        }, {
            "content": "LOAD",
            "handler": async () => {
                const res = await FileSystem.load(".json");
                if (res != null) {
                    const {data} = res;
                    if (data != null) {
                        editorEl.setConfig(data);
                    }
                }
            }
        }, {
            "content": "EXIT EDITOR",
            "handler": () => {
                editorEl.reset();
                const event = new Event("close");
                editorEl.dispatchEvent(event);
            }
        }]
    }];

    return {
        name: "World Editor",
        panel: editorEl,
        navigation: NAV
    }
}
