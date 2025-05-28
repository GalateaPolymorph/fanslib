import { TagDefinition } from "../../../../features/tags/entity";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ParentTagSelector } from "./ParentTagSelector";

type CategoricalValueInputProps = {
  displayName: string;
  value: string;
  description: string;
  parentTagId: number | null;
  shortRepresentation: string;
  availableTags: TagDefinition[];
  currentTagId?: number;
  onDisplayNameChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onParentTagChange: (parentId: number | null) => void;
  onShortRepresentationChange: (value: string) => void;
};

export const CategoricalValueInput = ({
  displayName,
  value,
  description,
  parentTagId,
  shortRepresentation,
  availableTags,
  currentTagId,
  onDisplayNameChange,
  onValueChange,
  onDescriptionChange,
  onParentTagChange,
  onShortRepresentationChange,
}: CategoricalValueInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Tag Name *</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          placeholder="e.g., Portrait, Landscape, Action"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Value</Label>
        <Input
          id="value"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Auto-generated from name if empty"
        />
        <p className="text-xs text-gray-500">
          Used for internal identification. Leave empty to auto-generate from the tag name.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Optional description for this tag"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Parent Tag</Label>
        <ParentTagSelector
          tags={availableTags}
          selectedParentId={parentTagId}
          currentTagId={currentTagId}
          onSelectParent={onParentTagChange}
          placeholder="Select parent tag (optional)"
        />
        <p className="text-xs text-gray-500">
          Choose a parent tag to create a hierarchy. Leave empty for root-level tags.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortRepresentation">Short Representation</Label>
        <Input
          id="shortRepresentation"
          value={shortRepresentation}
          onChange={(e) => onShortRepresentationChange(e.target.value)}
          placeholder="e.g., $, ★, HD, 4K"
          maxLength={10}
        />
        <p className="text-xs text-gray-500">
          Short text or symbol to display on media tiles (max 10 characters, optional).
        </p>
      </div>
    </div>
  );
};
