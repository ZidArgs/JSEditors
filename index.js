
import FileData from "/emcJS/storage/FileData.js";
import "/emcJS/ui/Paging.js";
import "/emcJS/ui/NavBar.js";
import FileSystem from "/emcJS/util/FileSystem.js";

import "/editors/AppChoice.js";
import "/editors/logic/LogicEditor.js";

import LogicListsCreator from "/utils/logic/LogicListsCreator.js";
import "/utils/logic/LiteralCustom.js";
import "/utils/logic/LiteralLinked.js";

import TrackerStorage from "/utils/TrackerStorage.js";

const FILES = {
    "items": "/database/items.json",
    "grids": "/database/grids.json",
    "dungeonstate": "/database/dungeonstate.json",
    "world": "/database/world.json",
    "world_lists": "/database/world_lists.json",
    "layouts": "/database/layouts.json",
    "songs": "/database/songs.json",
    "hints": "/database/hints.json",
    "logic": "/database/logic.json",
    "settings": "/database/settings.json",
    "randomizer_options": "/database/randomizer_options.json",
    "filter": "/database/filter.json",
    "shops": "/database/shops.json",
    "shop_items": "/database/shop_items.json"
};

const NAVIGATION = new Map();

let nav = document.getElementById("navbar");
let pager = document.getElementById("pager");
let appChoice = document.getElementById("appchoice");

!async function() {
    
    await FileData.load(FILES);

    // main
    !function() {
        appChoice.addEventListener("choice", function(event) {
            pager.active = event.app;
            if (NAVIGATION.has(event.app)) {
                nav.loadNavigation(NAVIGATION.get(event.app));
            } else {
                nav.loadNavigation([]);
            }
        });
        NAVIGATION.set("main", [{
            "content": "EXIT",
            "handler": () => {
                window.close()
            }
        }]);
        nav.loadNavigation(NAVIGATION.get("main"));
    }();

    // logic editor
    !async function() {
        let LogicsStorage = new TrackerStorage("logic");
        let logicEditor = document.getElementById("logic-editor");
        logicEditor.addEventListener("save", async event => {
            await LogicsStorage.set(event.key, event.logic);
            logicEditor.setPatch(await LogicsStorage.getAll());
        });
        logicEditor.addEventListener("clear", async event => {
            await LogicsStorage.delete(event.key);
            logicEditor.setPatch(await LogicsStorage.getAll());
        });
        NAVIGATION.set("logic-editor", [{
            "content": "FILE",
            "submenu": [{
                "content": "SAVE LOGIC",
                "handler": async () => {
                    let logic = JSON.parse(JSON.stringify(FileData.get("logic")));
                    let logic_patched = await LogicsStorage.getAll();
                    for (let i in logic_patched) {
                        if (!logic[i]) {
                            logic[i] = logic_patched[i];
                        } else {
                            for (let j in logic_patched[i]) {
                                logic[i][j] = logic_patched[i][j];
                            }
                        }
                    }
                    FileSystem.save(JSON.stringify(logic, " ", 4), "logic.json");
                }
            },{
                "content": "LOAD PATCH",
                "handler": async () => {
                    let res = await FileSystem.load(".json");
                    if (!!res && !!res.data) {
                        let logic = res.data;
                        await LogicsStorage.setAll(logic);
                        await logicEditor.refreshWorkingarea();
                    }
                }
            },{
                "content": "SAVE PATCH",
                "handler": async () => {
                    let logic = await LogicsStorage.getAll();
                    FileSystem.save(JSON.stringify(logic, " ", 4), `logic.${(new Date).valueOf()}.json`);
                }
            },{
                "content": "REMOVE PATCH",
                "handler": async () => {
                    await LogicsStorage.clear();
                    await logicEditor.refreshWorkingarea();
                }
            },{
                "content": "EXIT EDITOR",
                "handler": () => {
                    logic.resetWorkingarea();
                    pager.active = "main";
                    nav.loadNavigation(NAVIGATION.get("main"));
                }
            }]
        }]);
        let lists = await LogicListsCreator.createLists();
        logicEditor.loadOperatorList(lists.operators);
        logicEditor.loadLogicList(lists.logics);
        logicEditor.setLogic(FileData.get("logic", {}));
        logicEditor.setPatch(await LogicsStorage.getAll());
        // register
        appChoice.register("logic-editor", "LOGIC");
    }();

}();