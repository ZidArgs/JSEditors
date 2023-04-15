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
        const {location, exit, area, collection} = config;
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
            collection: {
                nodeType: "editor-world-category-collection",
                label: "Collections",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureCollections(collection)
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
                    map: {
                        nodeType: "editor-world-area-map-config",
                        label: "Map Config"
                    },
                    connections: {
                        nodeType: "editor-world-area-connections",
                        label: "Connections",
                        startCollapsed: true,
                        children: this.extractTreeStructureAreaConnections(data.connections)
                    },
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

    // TODO connections should be binary and have a label, stored in an array
    extractTreeStructureAreaConnections(areaConnectionItems = []) {
        const res = {};
        // for (const item of areaConnectionItems) {
        //     res[item.id] = {
        //         nodeType: "editor-world-area-connection-item",
        //         label: item.id,
        //         type: item.type ?? item.category
        //     };
        // }
        return res;
    }

    extractTreeStructureAreaList(areaListItems = []) {
        const res = {};
        for (const item of areaListItems) {
            res[item.id] = {
                nodeType: "editor-world-area-list-item",
                label: item.id,
                type: item.type ?? item.category
            };
        }
        return res;
    }

    extractTreeStructureCollections(collections) {
        const res = {};
        for (const ref in collections) {
            const data = collections[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "editor-world-collection",
                label: ref,
                type,
                children: {
                    list: {
                        nodeType: "editor-world-collection-list",
                        label: "List",
                        startCollapsed: true,
                        children: this.extractTreeStructureAreaList(data.list)
                    }
                }
            };
        }
        return res;
    }

    extractTreeStructureCollectionList(areaListItems = []) {
        const res = {};
        for (const item of areaListItems) {
            res[item.id] = {
                nodeType: "editor-world-collection-list-item",
                label: item.id,
                type: item.type ?? item.category
            };
        }
        return res;
    }

}
