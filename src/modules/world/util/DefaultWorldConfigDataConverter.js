import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";

export default class DefaultWorldConfigDataConverter {

    translateSetConfig(config) {
        config = deepClone(config);
        return config;
    }

    translateGetConfig(config) {
        config = deepClone(config);
        return config;
    }

    extractTreeStructure(config) {
        if (config == null) {
            return {};
        }
        const {location, exit, area} = config;
        const tree = {
            world: {
                nodeType: "editor-world-main-config",
                label: "World Config"
            },
            location: {
                nodeType: "editor-world-category-location",
                label: "Locations",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureLocations(location)
            },
            exit: {
                nodeType: "editor-world-category-exit",
                label: "Exits",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureExits(exit)
            },
            area: {
                nodeType: "editor-world-category-area",
                label: "Areas",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureAreas(area)
            }
        };
        return tree;
    }

    extractTreeStructureLocations(locations = {}) {
        console.log(locations)
        const res = {};
        for (const ref in locations) {
            const data = locations[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "editor-world-location",
                label: ref,
                type
            };
        }
        return res;
    }

    extractTreeStructureExits(exits = {}) {
        const res = {};
        for (const ref in exits) {
            const data = exits[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "editor-world-exit",
                label: ref,
                type
            };
        }
        return res;
    }

    extractTreeStructureAreas(areas = {}) {
        const res = {};
        for (const ref in areas) {
            const data = areas[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "editor-world-area",
                label: ref,
                type,
                children: {
                    list: {
                        nodeType: "editor-world-area-list",
                        label: "List",
                        startCollapsed: true,
                        children: this.extractTreeStructureAreaList(data.list)
                    }
                }
            };
        }
        return res;
    }

    extractTreeStructureAreaList(areaListItems = []) {
        const res = {};
        for (const item of areaListItems) {
            const type = item.type ?? item.category;
            if (type === "collection") {
                const list = item.list;
                res[item.id] = {
                    nodeType: "editor-world-area-listcategory",
                    label: item.id,
                    children: this.extractTreeStructureAreaList(list)
                };
            } else {
                res[item.id] = {
                    nodeType: "editor-world-area-listitem",
                    label: item.id,
                    type
                };
            }
        }
        return res;
    }

}
