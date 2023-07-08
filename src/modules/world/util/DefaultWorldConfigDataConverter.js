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
                nodeType: "editor-world-location",
                label: "Locations",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureLocations(location)
            },
            exit: {
                nodeType: "editor-world-exit",
                label: "Exits",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureExits(exit)
            },
            collection: {
                nodeType: "editor-world-collection",
                label: "Collections",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureCollections(collection)
            },
            area: {
                nodeType: "editor-world-area",
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
                nodeType: "editor-world-location-entry",
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
                nodeType: "editor-world-exit-entry",
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
                nodeType: "editor-world-area-entry",
                label: ref,
                type,
                children: {
                    map: {
                        nodeType: "editor-world-area-entry-map-config",
                        label: "Map Config"
                    },
                    connections: {
                        nodeType: "editor-world-area-entry-connections",
                        label: "Connections",
                        startCollapsed: true,
                        children: this.extractTreeStructureAreaConnections(data.connections)
                    },
                    list: {
                        nodeType: "editor-world-area-entry-list",
                        label: "List",
                        startCollapsed: true,
                        children: this.extractTreeStructureAreaList(data.list)
                    }
                }
            };
        }
        return res;
    }

    extractTreeStructureAreaConnections(areaConnectionItems = []) {
        const res = {};
        for (const index in areaConnectionItems) {
            const item = areaConnectionItems[index];
            res[index] = {
                nodeType: "editor-world-area-entry-connections-item",
                label: item.label,
                type: item.type ?? item.category
            };
        }
        return res;
    }

    extractTreeStructureAreaList(areaListItems = []) {
        const res = {};
        for (const index in areaListItems) {
            const item = areaListItems[index];
            res[index] = {
                nodeType: "editor-world-area-entry-list-item",
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
                nodeType: "editor-world-collection-entry",
                label: ref,
                type,
                children: {
                    list: {
                        nodeType: "editor-world-collection-entry-list",
                        label: "List",
                        startCollapsed: true,
                        children: this.extractTreeStructureCollectionList(data.list)
                    }
                }
            };
        }
        return res;
    }

    extractTreeStructureCollectionList(collectionListItems = []) {
        const res = {};
        for (const index in collectionListItems) {
            const item = collectionListItems[index];
            res[index] = {
                nodeType: "editor-world-collection-entry-list-item",
                label: item.id,
                type: item.type ?? item.category
            };
        }
        return res;
    }

}
