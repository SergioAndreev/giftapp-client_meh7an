interface RGB {
  r: number;
  g: number;
  b: number;
}

interface LottieColorValue {
  k: number[];
}

interface LottieItem {
  ty: string;
  c?: LottieColorValue;
  it?: LottieItem[];
}

interface LottieShape {
  it?: LottieItem[];
}

interface LottieLayer {
  shapes?: LottieShape[];
}

/**
 * Complete Lottie animation data structure
 * @interface LottieData
 */
export interface LottieData {
  layers: LottieLayer[];
  v: string;
  bfs?: number;
  [key: string]: unknown;
  ip: number;
  fr: number;
}

/**
 * Converts hex color string to RGB object
 * @param {string} hex - Hex color code (e.g. "#FF0000")
 * @returns {RGB} RGB color object
 */
export const hexToRGB = (hex: string): RGB => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

/**
 * Updates fill colors in Lottie animation data
 * Recursively traverses animation structure to find and update color values
 *
 * @param {LottieData} data - Original Lottie animation data
 * @param {string} color - New color in hex format
 * @returns {LottieData} Updated animation data
 */
export const updateAnimationColors = (
  data: LottieData,
  color: string
): LottieData => {
  const rgb = hexToRGB(color);
  const normalizedRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const newData = JSON.parse(JSON.stringify(data)) as LottieData;

  newData.layers.forEach((layer) => {
    if (layer.shapes) {
      layer.shapes.forEach((shape) => {
        if (shape.it) {
          shape.it.forEach((item) => {
            if (item.ty === "fl" && item.c?.k) {
              item.c.k = [...normalizedRGB, 1];
            }
          });
        }
      });
    }
  });

  return newData;
};
