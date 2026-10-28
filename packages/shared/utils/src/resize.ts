export interface ResizeOptions {
  from: {
    width: number;
    height: number;
  };
  to?:
    | {
        width?: number;
        height?: number;
      }
    | {
        maxWidth?: number;
        maxHeight?: number;
      };
}

export function resize({ from, to }: ResizeOptions) {
  if (!to) {
    return { width: from.width, height: from.height };
  }

  let width = from.width;
  let height = from.height;

  if ("width" in to || "height" in to) {
    if (to.width !== undefined && to.height !== undefined) {
      width = to.width;
      height = to.height;
    } else if (to.width !== undefined) {
      width = to.width;
      height = Math.round((from.height / from.width) * width);
    } else if (to.height !== undefined) {
      height = to.height;
      width = Math.round((from.width / from.height) * height);
    }
  } else if ("maxWidth" in to || "maxHeight" in to) {
    const ratio = from.width / from.height;
    width = from.width;
    height = from.height;

    if (to.maxWidth !== undefined && width > to.maxWidth) {
      width = to.maxWidth;
      height = Math.round(width / ratio);
    }
    if (to.maxHeight !== undefined && height > to.maxHeight) {
      height = to.maxHeight;
      width = Math.round(height * ratio);
    }
  }

  return { width, height };
}
