import { XIcon } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import z from "zod";

import { dedupe } from "@shared/utils";

import { useFieldContext } from "../context/app-form-context";

interface TagsFieldProps {
  maxTagCount?: number;
  maxTagLength?: number;
  minTagLength?: number;
  hideTagsCounter?: boolean;
  /** Called when some of the typed tags were ignored because they already exist. */
  onDuplicateTags?: () => void;
  /** Called with the validation message when the new tags are rejected. */
  onInvalidTag?: (message: string) => void;
}

export function TagsField({
  maxTagCount = 5,
  maxTagLength = 20,
  minTagLength = 1,
  hideTagsCounter = false,
  onDuplicateTags,
  onInvalidTag,
}: TagsFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const field = useFieldContext<string[] | undefined>();
  const tags = field.state.value || [];

  const tagArraySchema = z
    .array(
      z
        .string()
        .min(minTagLength, "Tag muito curta")
        .max(maxTagLength, "Tag muito longa"),
    )
    .max(maxTagCount, `Máximo de ${maxTagCount} tags atingido`);

  const totalTags = tags?.length || 0;

  function handleRemoveTag(indexToRemove: number) {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    field.setValue(newTags);
  }

  function addTag() {
    const tagText = inputValue.trim().toLowerCase();

    let newTags: string[] = [];

    if (tagText.includes(",")) {
      newTags = tagText.split(",").map((tag) => tag.trim().toLowerCase());
    } else {
      newTags = [tagText];
    }

    const tags2 = [...tags, ...newTags];

    const deDuplicatedTags = dedupe(tags2);

    if (deDuplicatedTags.length < tags2.length) {
      onDuplicateTags?.();
    }

    if (!tagText || newTags.length === 0) {
      return;
    }

    const { error, data: updatedTags } =
      tagArraySchema.safeParse(deDuplicatedTags);

    if (error) {
      onInvalidTag?.(error.issues[0]?.message ?? "Tag inválida");
      return;
    }

    field.setValue(updatedTags);
    setInputValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && inputValue === "" && totalTags > 0) {
      handleRemoveTag(totalTags - 1);
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="relative">
      {!hideTagsCounter && (
        <div className="absolute -top-6 right-0 mt-1 flex w-full justify-end text-[0.625rem] text-muted-foreground">
          {totalTags}/{maxTagCount}
        </div>
      )}
      <label
        htmlFor={field.name}
        className="relative flex h-fit max-h-25 w-full min-w-0 flex-wrap items-center gap-2 overflow-y-auto rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
      >
        {tags.map((tag, index) => (
          <div
            key={tag}
            className="flex shrink-0 items-center overflow-hidden rounded-md border border-primary bg-primary/10"
          >
            <span className="px-2 font-medium text-xs">#{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              aria-label={`Remover tag ${tag}`}
              className="flex h-full w-fit cursor-pointer items-center p-1 text-destructive-foreground transition-colors hover:bg-destructive/30"
            >
              <XIcon size={12} />
            </button>
          </div>
        ))}
        <input
          id={field.name}
          type="text"
          value={inputValue}
          onBlur={addTag}
          onKeyUp={handleKeyDown}
          className="h-fit min-w-30 grow appearance-none border-none bg-transparent p-1 outline-none focus-visible:ring-0"
          onChange={(e) => setInputValue(e.target.value.trim())}
          placeholder={
            totalTags < maxTagCount
              ? "Digite a tag e pressione Enter..."
              : `Máximo de ${maxTagCount} tags`
          }
          disabled={totalTags >= maxTagCount}
        />
      </label>
    </div>
  );
}
