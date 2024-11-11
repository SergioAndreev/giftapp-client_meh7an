/**
 * Converts a hex color string to normalized RGBA array.
 * Supports both 8-digit (with alpha) and 6-digit hex colors.
 *
 * @param hex - Hex color string (format: "#RRGGBBAA" or "#RRGGBB")
 * @returns Normalized RGBA array [r, g, b, a] where each value is between 0 and 1
 *
 * @example
 * ```ts
 * // Full opacity red
 * hexToRgbaArr("#FF0000FF"); // Returns [1, 0, 0, 1]
 *
 * // 50% opacity blue
 * hexToRgbaArr("#0000FF80"); // Returns [0, 0, 1, 0.5]
 *
 * // No alpha specified (defaults to 1)
 * hexToRgbaArr("#00FF00"); // Returns [0, 1, 0, 1]
 * ```
 *
 * @remarks
 * - Input must include the "#" prefix
 * - Values are normalized to 0-1 range for use in WebGL/Canvas contexts
 * - Alpha defaults to 1 if not provided in hex string
 */
export default function hexToRgbaArr(
  hex: string
): [number, number, number, number] {
  const rgba = [1, 3, 5, 7].map(
    (i) => parseInt(hex.slice(i, i + 2) || "FF", 16) / 255
  );
  return rgba as [number, number, number, number];
}
