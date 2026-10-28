import { ArrowBigRight, CheckIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "tailwind-variants";

import { beautifyBytes } from "@web/shared/utils/formatters/beautify-bytes";
import { Button } from "@web/ui/button";
import { Dialog } from "@web/ui/dialog";
import { Image } from "@web/ui/image";
import { RoundedIcon } from "@web/ui/rounded-icon";

import { useCropImageFieldContext } from "../hooks/use-crop-image-field-context";

export function SendImage() {
  const {
    imageAspectRation,
    image,
    onSubmit,
    imagePreviewUrl,
    previousImageUrl,
    uncroppableFileTypes,
    maxFileSizeInBytes,
    resetForm,
  } = useCropImageFieldContext();
  const [error, setError] = useState<string | null>(null);
  const isSentWhole = !!image && !!uncroppableFileTypes?.includes(image.type);
  const objectUrl = imagePreviewUrl ?? "";

  const isSquare = imageAspectRation === 1;

  const dialogDescription = isSquare
    ? "Sua nova foto de perfil está pronta para o show! Confirme para que a galera veja a nova cara do seu perfil."
    : "Pronto para um novo visual? Confirme para atualizar seu banner e dar um toque especial ao seu perfil.";

  function handleConfirm() {
    if (!image) {
      return;
    }

    if (maxFileSizeInBytes && image.size > maxFileSizeInBytes) {
      setError(`Essa imagem passa de ${beautifyBytes(maxFileSizeInBytes, 0)}.`);
      return;
    }

    onSubmit(image);
  }

  return (
    <div className="w-md max-w-full space-y-6">
      <Dialog.header>
        <Dialog.title>
          <RoundedIcon>
            <CheckIcon className="size-5" />
          </RoundedIcon>
          Tudo certo?
        </Dialog.title>
        <Dialog.description>{dialogDescription}</Dialog.description>
      </Dialog.header>

      <div className="flex w-full items-center justify-center gap-4">
        {!!previousImageUrl && (
          <div
            style={{ aspectRatio: imageAspectRation }}
            className={cn(
              "h-24 overflow-hidden border-2 border-primary object-center",
              {
                "rounded-full": isSquare,
                "rounded-md": !isSquare,
              },
            )}
          >
            <Image
              alt="Sua imagem atual"
              src={previousImageUrl}
              height={100}
              width={100}
              className="size-full object-cover object-center"
              style={{ aspectRatio: imageAspectRation }}
            />
          </div>
        )}
        {!!previousImageUrl && (
          <ArrowBigRight className="fill-primary text-primary" />
        )}
        <div
          style={{ aspectRatio: imageAspectRation }}
          className={cn("h-24 overflow-hidden border-2 border-primary", {
            "rounded-full": isSquare,
            "rounded-md": !isSquare,
          })}
        >
          {!!image && (
            <Image
              alt="Sua nova imagem"
              className="size-full object-cover object-center"
              src={objectUrl}
              height={100}
              width={100}
            />
          )}
        </div>
      </div>

      {isSentWhole && (
        <p className="text-center text-muted-foreground text-xs">
          Essa imagem vai inteira, sem corte: ela se ajusta ao tamanho que
          aparece no perfil.
        </p>
      )}

      {!!error && (
        <p role="alert" className="text-center text-destructive text-sm">
          {error}
        </p>
      )}

      <Dialog.footer className="flex-row">
        <Button raised onClick={resetForm} variant="outline">
          Cancelar
        </Button>
        <Button raised onClick={handleConfirm}>
          Confirmar
        </Button>
      </Dialog.footer>
    </div>
  );
}
