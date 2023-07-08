import DefaultWorldConfigDataConverter from "/JSEditors/modules/world/util/DefaultWorldConfigDataConverter.js";

export default class WorldConfigDataConverter extends DefaultWorldConfigDataConverter {

    extractTreeStructureAreas(areas = {}) {
        const res = super.extractTreeStructureAreas(areas);
        for (const ref in areas) {
            const data = areas[ref];
            if (data.list_mq != null) {
                res[ref].children["list_mq"] = {
                    nodeType: "editor-world-area-entry-list",
                    label: "List (Master Quest)",
                    startCollapsed: true,
                    children: this.extractTreeStructureAreaList(data.list_mq)
                }
            }
        }
        return res;
    }

}
