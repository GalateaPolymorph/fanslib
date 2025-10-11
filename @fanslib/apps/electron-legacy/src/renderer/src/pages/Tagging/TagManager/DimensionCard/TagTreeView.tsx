import { useMemo } from "react";
import { TagDefinition } from "../../../../../../features/tags/entity";
import { TreeNode, TreeNodeComponent } from "./TreeNodeComponent";

type TagTreeViewProps = {
  tags: TagDefinition[];
  selectedTagId?: number;
  onSelectTag?: (tagId: number) => void;
  onEditTag: (tag: TagDefinition) => void;
  onDeleteTag: (tagId: number) => void;
  onCreateTag: (parentTagId?: number) => void;
  onUpdateParent: (tagId: number, newParentId: number | null) => void;
};

const buildTagTree = (tags: TagDefinition[]): TreeNode[] => {
  const tagMap = new Map<number, TagDefinition>();
  tags.forEach((tag) => tagMap.set(tag.id, tag));

  const rootTags: TreeNode[] = [];
  const processedTags = new Set<number>();

  const buildNode = (tag: TagDefinition, level: number = 0): TreeNode => {
    const children = tags
      .filter((t) => t.parentTagId === tag.id)
      .map((child) => buildNode(child, level + 1));

    return {
      ...tag,
      children,
      level,
    };
  };

  // Find root tags (tags without parents or with non-existent parents)
  tags.forEach((tag) => {
    if (!tag.parentTagId || !tagMap.has(tag.parentTagId)) {
      if (!processedTags.has(tag.id)) {
        rootTags.push(buildNode(tag));
        processedTags.add(tag.id);
      }
    }
  });

  // Sort root tags by display name
  return rootTags.sort((a, b) => a.displayName.localeCompare(b.displayName));
};

export const TagTreeView = ({
  tags,
  selectedTagId,
  onSelectTag,
  onEditTag,
  onDeleteTag,
  onCreateTag,
  onUpdateParent,
}: TagTreeViewProps) => {
  const treeNodes = useMemo(() => buildTagTree(tags), [tags]);

  if (treeNodes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No tags to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {treeNodes.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          onUpdateParent={onUpdateParent}
          onDeleteTag={onDeleteTag}
          onCreateTag={onCreateTag}
          onEditTag={onEditTag}
          selectedTagId={selectedTagId}
          onSelectTag={onSelectTag}
          allTags={tags}
        />
      ))}
    </div>
  );
};
