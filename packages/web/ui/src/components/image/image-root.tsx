import { ImageOffIcon, RotateCwIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { cn } from "tailwind-variants";

import { Button } from "../button";
import { Card } from "../card";
import type { ImageRegistry } from "./index";

type KnownImage = ImageRegistry extends { src: infer TSrc extends string }
  ? TSrc
  : never;

interface ImageProps extends ComponentProps<"img"> {
  src: KnownImage | (string & {});
  priority?: boolean;
}

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
            <ImageOffIcon className="size-5 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Link da imagem inválido
            </p>
          </Card.content>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Button
          className="w-fit px-2"
          variant="ghost"
          title="Tentar novamente"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setError(false);
          }}
        >
          <ImageOffIcon className="size-5 text-destructive" />
          <RotateCwIcon />
        </Button>
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
