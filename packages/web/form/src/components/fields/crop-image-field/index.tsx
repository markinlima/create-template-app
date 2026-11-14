import { CropImageFieldChooseImage } from "./components/crop-image-field-choose-image";
import { CropImageFieldCropImage } from "./components/crop-image-field-crop-image";
import { CropImageFieldRoot } from "./components/crop-image-field-root";
import { CropImageFieldSendImage } from "./components/crop-image-field-send-image";

/** The `CropImageField` field, bound to the field of its `form.AppField`, with the steps of its dialog as parts. */
export const CropImageField = Object.assign(CropImageFieldRoot, {
  chooseImage: CropImageFieldChooseImage,
  cropImage: CropImageFieldCropImage,
  sendImage: CropImageFieldSendImage,
});
