import FileSystem from "/emcJS/util/file/FileSystem.js";
import OptionGroupRegistry from "/emcJS/data/registry/form/OptionGroupRegistry.js";
import TokenRegistry from "/emcJS/data/registry/form/TokenRegistry.js";
import "/JSEditors/modules/world/WorldEditor.js";
import WorldConfigDataConverter from "./util/WorldConfigDataConverter.js";

const OPTION_GROUPS = {
    "worldEditor_locationTypes": {
        "chest": "Chest",
        "skulltula": "Skulltula",
        "gossipstone": "Gossipstone",
        "scrub": "Scrub",
        "bean": "Bean",
        "cow": "Cow"
    },
    "worldEditor_locationIcons": {
        "": "",
        "/images/icons/chest.svg": "Chest",
        "/images/icons/skulltula.svg": "Skulltula",
        "/images/icons/gossipstone.svg": "Gossipstone",
        "/images/icons/scrub.svg": "Scrub",
        "/images/icons/bean.svg": "Bean",
        "/images/icons/cow.svg": "Cow"
    },
    "worldEditor_areaTypes": {
        "overworld": "Overworld",
        "area": "Area",
        "dungeon": "Dungeon",
        "interior": "Interior"
    },
    "worldEditor_areaIcons": {
        "": "",
        "/images/icons/area.svg": "Area",
        "/images/icons/dungeon.svg": "Dungeon",
        "/images/icons/dungeon_boss.svg": "Boss Dungeon",
        "/images/icons/area_boss.svg": "Boss Area",
        "/images/icons/interior.svg": "Interior"
    },
    "worldEditor_areaMapImages": {
        "": "",
        "/images/maps/hyrule.png": "Hyrule",
        "/images/maps/dungeon/deku.png": "Deku Tree",
        "/images/maps/dungeon/dodongo.png": "Dodongos Cavern",
        "/images/maps/dungeon/jabu.png": "Jabu Jabu"
    },
    "worldEditor_exitTypes": {
        "overworld": "Overworld",
        "dungeon_inner": "Dungeon Inner",
        "dungeon_outer": "Dungeon Outer",
        "interior_outer": "Interior Outer",
        "interior_inner": "Interior Outer",
        "grotto_outer": "Grotto Outer",
        "grotto_inner": "Grotto Outer",
        "flight": "Flight",
        "spawn": "Spawn",
        "warp": "Warp",
        "voided": "Voided"
    },
    "worldEditor_exitIcons": {
        "": "",
        "/images/icons/entrance.svg": "Entrance",
        "/images/icons/dungeon.svg": "Dungeon",
        "/images/icons/dungeon_boss.svg": "Boss Dungeon",
        "/images/icons/area_boss.svg": "Boss Area"
    },
    "worldEditor_areaContentHints": {
        "chest": "Chest",
        "skulltula": "Skulltula",
        "gossipstone": "Gossipstone",
        "scrub": "Scrub",
        "bean": "Bean",
        "cow": "Cow",
        "fountain": "Fountain",
        "rupees": "Rupees"
    }
};

const TOKEN_GROUPS = {};

const FILTER_CONFIG = {
    "era": [
        "both",
        "child",
        "adult"
    ],
    "time": [
        "both",
        "day",
        "night"
    ],
    "chests": [
        "true",
        "false"
    ],
    "skulltulas": [
        "true",
        "dungeons",
        "overworld",
        "false"
    ],
    "gossipstones": [
        "true",
        "false"
    ],
    "show_done": [
        "true",
        "false"
    ]
};

export default async function() {
    const editorEl = document.createElement("jse-world-editor");
    editorEl.configDataConverter = new WorldConfigDataConverter();
    editorEl.addEventListener("change", () => {
        const config = editorEl.getConfig();
        console.log("change config:", config);
    })

    // refresh
    async function refreshFn() {
        OptionGroupRegistry.load(OPTION_GROUPS);
        TokenRegistry.load(TOKEN_GROUPS);
        editorEl.setFilterConfig(FILTER_CONFIG);
    }

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
        navigation: NAV,
        refreshFn
    }
}
