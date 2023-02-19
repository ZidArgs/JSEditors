import DefaultWorldConfigDataConverter from "/JSEditors/modules/world/util/DefaultWorldConfigDataConverter.js";

export default class WorldConfigDataConverter extends DefaultWorldConfigDataConverter {

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
                        label: "List (Vanilla)",
                        startCollapsed: true,
                        children: this.extractTreeStructureAreaList(data.list)
                    }
                }
            };
            if (data.list_mq != null) {
                res[ref].children["list_mq"] = {
                    nodeType: "editor-world-area-list",
                    label: "List (Master Quest)",
                    startCollapsed: true,
                    children: this.extractTreeStructureAreaList(data.list_mq)
                }
            }
        }
        return res;
    }

}
