/**
 * Converts pixels to rem units based on the current root font size.
 * Dynamically reads the root font size from document for accurate conversion.
 *
 * @param px - Value in pixels to convert
 * @returns Equivalent value in rem units
 *
 * @example
 * ```ts
 * // With default root font size (16px)
 * pxToRem(32); // Returns 2 (2rem)
 * pxToRem(24); // Returns 1.5 (1.5rem)
 *
 * // Adapts to custom root font sizes automatically
 * // If root font-size is 20px:
 * pxToRem(40); // Returns 2 (2rem)
 * ```
 *
 * @remarks
 * - Uses live computation of root font size
 * - Handles custom root font sizes correctly
 * - Useful for responsive design calculations
 */
export const pxToRem = (px: number) => {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return px / rootFontSize;
};
