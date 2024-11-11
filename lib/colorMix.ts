/**
 * Mixes two hex colors together with a specified blend amount.
 * Performs linear interpolation between RGB values of the colors.
 *
 * @param c1 - First hex color (format: "#RRGGBB")
 * @param c2 - Second hex color (format: "#RRGGBB")
 * @param amount - Blend amount from 0 to 1 (default: 0)
 *   - 0: Returns first color (c1)
 *   - 0.5: Equal mix of both colors
 *   - 1: Returns second color (c2)
 * @returns Mixed color as hex string (format: "RRGGBB", no #)
 *
 * @example
 * ```ts
 * // Equal mix of red and blue
 * const purple = colorMix("#FF0000", "#0000FF", 0.5); // Returns "800080"
 *
 * // 30% blend of white into black
 * const darkGrey = colorMix("#000000", "#FFFFFF", 0.3); // Returns "4D4D4D"
 * ```
 *
 * @remarks
 * - Input colors must include the "#" prefix
 * - Output color does NOT include the "#" prefix
 * - Uses bitwise operations for performance
 */
export const colorMix = (c1: string, c2: string, amount = 0): string => {
  const parse = (c: string) =>
    [1, 3, 5].map((i) => parseInt(c.substring(i, i + 2), 16));
  const mix = (x: number, y: number) =>
    Math.round(x * (1 - amount) + y * amount);
  const [r1, g1, b1, r2, g2, b2] = [...parse(c1), ...parse(c2)];

  return ((1 << 24) + (mix(r1, r2) << 16) + (mix(g1, g2) << 8) + mix(b1, b2))
    .toString(16)
    .slice(1);
};
