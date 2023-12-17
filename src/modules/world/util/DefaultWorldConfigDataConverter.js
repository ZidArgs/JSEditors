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
                nodeType: "jse-world::world-config",
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
                type
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
                type
            };
        }
        return res;
    }

}
