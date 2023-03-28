import FileSystem from "/emcJS/util/file/FileSystem.js";
import OptionGroupRegistry from "/emcJS/data/registry/OptionGroupRegistry.js";
import TokenRegistry from "/emcJS/data/registry/TokenRegistry.js";
import "/JSEditors/modules/world/WorldEditor.js";
import WorldConfigDataConverter from "./util/WorldConfigDataConverter.js";
import OPTION_GROUPS from "./config/OptionGroups.json" assert {type: "json"};
import TOKEN_GROUPS from "./config/TokenGroups.json" assert {type: "json"};

export default async function() {
    OptionGroupRegistry.load(OPTION_GROUPS);
    TokenRegistry.load(TOKEN_GROUPS);

    const editorEl = document.createElement("jse-world-editor");
    editorEl.configDataConverter = new WorldConfigDataConverter();

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
