import TreeNode from "/emcJS/ui/tree/components/TreeNode.js";
import WorldEditorTreeNode from "../../ui/tree/WorldEditorTreeNode.js";

export default class TreeNode_WorldConfig extends WorldEditorTreeNode {

    get type() {
        return "worldconfig";
    }

}

TreeNode.registerNodeType("jse-world::world-config", TreeNode_WorldConfig);
customElements.define("jse-world-tree-node-config", TreeNode_WorldConfig);
