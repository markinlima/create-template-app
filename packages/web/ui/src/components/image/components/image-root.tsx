import { ImageOffIcon, RotateCwIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { cn } from "tailwind-variants";

import { Card } from "../../card";
import type { ImageRegistry } from "..";

type KnownImage = ImageRegistry extends { src: infer TSrc extends string }
  ? TSrc
  : never;

interface ImageProps extends ComponentProps<"img"> {
  src: KnownImage | (string & {});
  priority?: boolean;
}

/** The root of an {@link Image}: the picture with its placeholder while it loads. */
export function ImageRoot({
  alt,
  height,
  className,
  priority = false,
  src,
  width,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);

  const isUrl = URL.canParse(src);
  const isLocalImage = src.startsWith("/");
  const imageSrc = isUrl ? src : `/images${src}`;

  if (!isUrl && !isLocalImage) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Card className="mx-auto w-fit max-w-sm">
          <Card.content className="flex items-center gap-3 p-4">
            <ImageOffIcon className="text-muted-foreground size-5" />
            <p className="text-muted-foreground text-sm">
              Link da imagem inválido
            </p>
          </Card.content>
        </Card>
      </div>
    );
  }

  if (error) {
    function retry() {
      setError(false);
    }

    return (
      <div className="flex h-full flex-1 items-center justify-center">
        {/* biome-ignore lint/a11y/useSemanticElements: a real button cannot be nested in the buttons and links that wrap an image */}
        <span
          role="button"
          tabIndex={0}
          title="Tentar novamente"
          aria-label="Tentar novamente"
          className="hover:border-input/50 hover:bg-accent focus-visible:border-ring inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-transparent px-2 transition-all outline-none select-none"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            retry();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              e.preventDefault();
              retry();
            }
          }}
        >
          <ImageOffIcon className="text-destructive size-5" />
          <RotateCwIcon className="size-4" />
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      draggable={false}
      className={cn(className)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      decoding="async"
      onError={() => setError(true)}
      {...props}
    />
  );
}
