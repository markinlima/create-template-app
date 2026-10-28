import { CropIcon } from "lucide-react";
import { useId, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@web/ui/button";
import { Dialog } from "@web/ui/dialog";
import { RoundedIcon } from "@web/ui/rounded-icon";
import { Slider } from "@web/ui/slider";

import { useCropImageFieldContext } from "../hooks/use-crop-image-field-context";
import { getCroppedImg } from "../utils/cropped-image";

export function CropImage() {
  const {
    resetForm,
    imageAspectRation,
    image,
    handleNextStep,
    setImage,
    imagePreviewUrl,
  } = useCropImageFieldContext();

  const zoomSlideId = useId();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);

  async function handleCompleteCrop(_: Area, croppedAreaPixels: Area) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function handleSubmit() {
    if (!image || !imagePreviewUrl) {
      return;
    }

    const newImage = await getCroppedImg({
      imageSrc: imagePreviewUrl,
      image: image,
      pixelCrop: croppedAreaPixels,
    });

    if (!newImage) {
      throw new Error("Failed to crop image");
    }

    setImage(newImage);

    handleNextStep();
  }

  return (
    <div className="w-xl max-w-full space-y-6">
      <Dialog.header>
        <Dialog.title>
          <RoundedIcon>
            <CropIcon className="size-5" />
          </RoundedIcon>
          Cortar Imagem
        </Dialog.title>
      </Dialog.header>
      <div className="relative h-[350px] overflow-hidden rounded-md border bg-muted">
        <Cropper
          style={{
            containerStyle: { width: "100%", height: "100%" },
          }}
          image={imagePreviewUrl ?? ""}
          crop={crop}
          zoom={zoom}
          aspect={imageAspectRation}
          onCropChange={setCrop}
          onCropComplete={handleCompleteCrop}
          showGrid={true}
          onZoomChange={setZoom}
          maxZoom={3}
          minZoom={1}
        />
      </div>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          <label htmlFor={zoomSlideId} className="w-16 font-medium text-sm">
            Zoom
          </label>
          <Slider
            id={zoomSlideId}
            value={[zoom]}
            onValueChange={(value) => {
              if (Array.isArray(value)) {
                setZoom(value[0]);
              }

              setZoom(value as number);
            }}
            max={3}
            min={1}
            step={0.01}
            className="flex-1"
          />
          <span className="w-8 text-right text-muted-foreground text-sm">
            {(zoom * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <Dialog.footer className="flex-row">
        <Button raised onClick={resetForm} variant="outline">
          Cancelar
        </Button>
        <Button raised onClick={handleSubmit}>
          Confirmar
        </Button>
      </Dialog.footer>
    </div>
  );
}
