class TreeNode:
    def __init__(self, type: str):
        self.type = type

    def add_child(self, child_node):
        if not self.children:
            self.children = [child_node]
        else:
            self.children.append(child_node)

    def dict(self):
        tree = self.__dict__
        if "children" in tree:
            tree["children"] = [child.dict() for child in tree["children"]]
        return tree
