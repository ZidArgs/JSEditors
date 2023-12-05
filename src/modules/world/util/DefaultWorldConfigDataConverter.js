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
        const {locations, exits, areas, collections} = config;
        const tree = {
            world: {
                nodeType: "jse-world::main-config",
                label: "World Config"
            },
            locations: {
                nodeType: "jse-world::locations",
                label: "Locations",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureLocations(locations)
            },
            exits: {
                nodeType: "jse-world::exits",
                label: "Exits",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureExits(exits)
            },
            collections: {
                nodeType: "jse-world::collections",
                label: "Collections",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureCollections(collections)
            },
            areas: {
                nodeType: "jse-world::areas",
                label: "Areas",
                sorted: true,
                startCollapsed: true,
                children: this.extractTreeStructureAreas(areas)
            }
        };
        console.log("extracted tree", tree);
        return tree;
    }

    extractTreeStructureLocations(locations = {}) {
        const res = {};
        for (const ref in locations) {
            const data = locations[ref];
            const type = data.type;
            res[ref] = {
                nodeType: "jse-world::locations-entry",
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
                nodeType: "jse-world::exits-entry",
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
                nodeType: "jse-world::areas-entry",
                label: ref,
                type,
                children: {
                    map: {
                        nodeType: "jse-world::areas-entry-map-config",
                        label: "Map Config"
                    },
                    connections: {
                        nodeType: "jse-world::areas-entry-connections",
                        label: "Connections",
                        startCollapsed: true,
                        children: this.extractTreeStructureAreasConnections(data.connections)
                    },
                    lists: {
                        nodeType: "jse-world::areas-entry-lists",
                        label: "Lists",
                        startCollapsed: true,
                        children: {}
                    }
                }
            };
            for (const [name, list] of Object.entries(data.lists)) {
                res[ref].children.lists.children[name] = {
                    nodeType: "jse-world::areas-entry-lists-entry",
                    label: `List: ${name}`,
                    startCollapsed: true,
                    children: this.extractTreeStructureAreasList(list)
                }
            }
        }
        return res;
    }

    extractTreeStructureAreasConnections(areaConnectionItems = []) {
        const res = {};
        for (const index in areaConnectionItems) {
            const item = areaConnectionItems[index];
            res[index] = {
                nodeType: "jse-world::areas-entry-connections-item",
                label: item.label,
                type: "Connection"
            };
        }
        return res;
    }

    extractTreeStructureAreasList(areaListItems = []) {
        const res = {};
        for (const index in areaListItems) {
            const item = areaListItems[index];
            res[index] = {
                nodeType: "jse-world::areas-entry-lists-entry-item",
                label: item.ref?.name ?? "",
                type: item.ref?.type ?? ""
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
                nodeType: "jse-world::collections-entry",
                label: ref,
                type,
                children: {
                    list: {
                        nodeType: "jse-world::collections-entry-list",
                        label: "List",
                        startCollapsed: true,
                        children: this.extractTreeStructureCollectionsList(data.list)
                    }
                }
            };
        }
        return res;
    }

    extractTreeStructureCollectionsList(collectionListItems = []) {
        const res = {};
        for (const index in collectionListItems) {
            const item = collectionListItems[index];
            res[index] = {
                nodeType: "jse-world::collections-entry-list-item",
                label: item.ref?.name ?? "",
                type: item.ref?.type ?? ""
            };
        }
        return res;
    }

}
