import scope from "../../data/WorldEditorScope.js";

export default class Controller_Config extends EventTarget {

    constructor(editorEl, treeEl, detailEditorEl) {
        super();
        treeEl.addEventListener("mainConfigSelect", () => {
            scope.editPath = [];
            if (detailEditorEl != null) {
                const data = this.getConfigData();
                detailEditorEl.setData(data);
            }
            editorEl.switchDetailEditor(detailEditorEl);
        });
        /* --- */
        if (detailEditorEl != null) {
            detailEditorEl.addEventListener("save", (event) => {
                const mainConfig = scope.config.config;
                scope.config.config = { // TODO
                    ...mainConfig,
                    ...event.data
                    /*
        "defaultArea": "hyrule",
        "areaContentHints": {
            "chest": {
                "icon": "/images/icons/chest.svg",
                "counting": false
            },
            "skulltula": {
                "icon": "/images/icons/skulltula.svg",
                "counting": false
            },
            "gossipstone": {
                "icon": "/images/icons/gossipstone.svg",
                "counting": false
            },
            "scrub": {
                "icon": "/images/icons/scrub.svg",
                "counting": true
            },
            "cow": {
                "icon": "/images/icons/cow.svg",
                "counting": false
            },
            "fountain": {
                "icon": "/images/icons/fairy_fountain.svg",
                "counting": false
            },
            "rupees": {
                "icon": "/images/icons/rupees.svg",
                "counting": false
            },
            "beehive": {
                "icon": "/images/icons/beehive.svg",
                "counting": true
            },
            "pot": {
                "icon": "/images/icons/pot.svg",
                "counting": true
            }
        },
        "region": {
            "root": "root",
            "prefix": "region[",
            "postfix": "]"
        },
        "gateways": {
            "incoming": {
                "prefix": "",
                "postfix": ":in"
            },
            "outgoing": {
                "prefix": "",
                "postfix": ":out"
            },
            "variants": [
                "child",
                "adult"
            ]
        }
                    */
                };
                editorEl.dispatchEvent(new Event("change"));
            });
        }
    }

    getConfigData() {
        return scope.config.config;
    }

}
