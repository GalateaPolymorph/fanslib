import { X } from "lucide-react";
import { useState } from "react";
import { MediaTag, TagDimension } from "../../../../features/tags/entity";
import { useCreateTagDefinition, useTagsByDimension } from "../../hooks/tags";
import {
  formatBooleanValue,
  parseBooleanSchema,
  validateBooleanValue,
} from "../../lib/tagValidation";
import { Switch } from "../ui/switch";

type BooleanTagSelectorProps = {
  dimension: TagDimension;
  selectedTags: MediaTag[];
  onTagsChange: (tagIds: number[]) => void;
};

export const BooleanTagSelector = ({
  dimension,
  selectedTags,
  onTagsChange,
}: BooleanTagSelectorProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: availableTags, refetch: refetchTags } = useTagsByDimension(dimension.id);
  const createTagMutation = useCreateTagDefinition();

  const schema = parseBooleanSchema(dimension.validationSchema);
  const selectedTag = selectedTags[0]; // Boolean dimensions should only have one selected tag

  const validateAndCreateTag = async (value: boolean) => {
    const validationError = validateBooleanValue(value, schema);
    if (validationError) {
      setError(validationError);
      return null;
    }

    // Check if tag already exists
    const existingTag = availableTags?.find((tag) => {
      return tag.value.toLowerCase() === value.toString();
    });

    if (existingTag) {
      return existingTag;
    }

    // Create new tag
    setIsCreating(true);
    try {
      const newTag = await createTagMutation.mutateAsync({
        dimensionId: dimension.id,
        value: value.toString(),
        displayName: formatBooleanValue(value, schema),
        description: `${dimension.name}: ${formatBooleanValue(value, schema)}`,
      });

      await refetchTags();
      return newTag;
    } catch (err) {
      setError("Failed to create tag");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    setError(null);
    const tag = await validateAndCreateTag(checked);
    if (tag) {
      onTagsChange([tag.id]);
    }
  };

  const handleRemoveTag = () => {
    onTagsChange([]);
  };

  const getCurrentValue = (): boolean => {
    if (selectedTag?.tag?.value) {
      return selectedTag.tag.value.toLowerCase() === "true";
    }
    return schema.defaultValue ?? false;
  };

  return (
    <div>
      {selectedTag ? (
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {selectedTag.tag?.displayName || formatBooleanValue(getCurrentValue(), schema)}
            <button
              onClick={handleRemoveTag}
              className="hover:bg-purple-200 rounded-full p-0.5"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Switch
              checked={getCurrentValue()}
              onCheckedChange={handleToggle}
              disabled={isCreating}
            />
            <div className="flex gap-2 text-sm text-gray-600">
              <span className={getCurrentValue() ? "font-medium" : ""}>
                {schema.falseLabel || "No"}
              </span>
              <span>/</span>
              <span className={getCurrentValue() ? "font-medium" : ""}>
                {schema.trueLabel || "Yes"}
              </span>
            </div>
            {isCreating && <span className="text-xs text-gray-500">Setting...</span>}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <p className="text-xs text-gray-500">Toggle to set value</p>
        </div>
      )}
    </div>
  );
};
