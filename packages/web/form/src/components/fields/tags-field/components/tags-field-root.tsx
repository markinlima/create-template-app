import { XIcon } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { cn } from "tailwind-variants";
import z from "zod";

import { dedupe } from "@shared/utils";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";

interface TagsFieldProps {
  /**
   * Most tags the field accepts.
   * @defaultValue 5
   */
  maxTagCount?: number;
  /**
   * Longest tag, in characters.
   * @defaultValue 20
   */
  maxTagLength?: number;
  /**
   * Shortest tag, in characters.
   * @defaultValue 1
   */
  minTagLength?: number;
  /**
   * Hides the `n/max` counter.
   * @defaultValue false
   */
  hideTagsCounter?: boolean;
  /** Called when some of the typed tags were ignored because they already exist. */
  onDuplicateTags?: () => void;
  /** Called with the validation message when the new tags are rejected. */
  onInvalidTag?: (message: string) => void;
}

/** A list of tags typed one by one (Enter or space adds one), bound to the field. */
export function TagsFieldRoot({
  maxTagCount = 5,
  maxTagLength = 20,
  minTagLength = 1,
  hideTagsCounter = false,
  onDuplicateTags,
  onInvalidTag,
}: TagsFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const field = useFieldContext<string[] | undefined>();
  const { id, invalidProps } = useFieldAria();
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

    // NOTE: keydown, not keyup: the form submits on the keydown of Enter, so only preventing it there stops that
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div
      className={cn(
        "relative",
        // NOTE: 24px room for the counter, which shares the label row when a label comes first
        !hideTagsCounter && "[&:not(label+*)]:mt-6",
      )}
    >
      {!hideTagsCounter && (
        <div className="text-muted-foreground absolute -top-6 right-0 mt-1 flex w-full justify-end text-[0.625rem]">
          {totalTags}/{maxTagCount}
        </div>
      )}
      <label
        htmlFor={id}
        className="border-input focus-within:border-ring focus-within:ring-ring/30 dark:bg-input/30 relative flex h-fit max-h-25 w-full min-w-0 flex-wrap items-center gap-2 overflow-y-auto rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] focus-within:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      >
        {tags.map((tag, index) => (
          <div
            key={tag}
            className="border-primary bg-primary/10 flex shrink-0 items-center overflow-hidden rounded-md border"
          >
            <span className="px-2 text-xs font-medium">#{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              aria-label={`Remover tag ${tag}`}
              className="text-destructive-foreground hover:bg-destructive/30 flex h-full w-fit cursor-pointer items-center p-1 transition-colors"
            >
              <XIcon size={12} />
            </button>
          </div>
        ))}
        <input
          id={id}
          {...invalidProps}
          type="text"
          value={inputValue}
          onBlur={addTag}
          onKeyDown={handleKeyDown}
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
