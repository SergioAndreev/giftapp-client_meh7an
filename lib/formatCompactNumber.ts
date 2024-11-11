/**
 * Formats a number into a compact string representation (e.g., 1K, 1M, 1B)
 * @param number The number to format
 * @returns Formatted string
 * @example
 * formatCompactNumber(1234) // "1.2K"
 * formatCompactNumber(1234567) // "1.2M"
 * formatCompactNumber(1234567890) // "1.2B"
 */
export const formatCompactNumber = (number: number): string => {
  const absNumber = Math.abs(number);

  // Handle values less than 1000
  if (absNumber < 1000) {
    return number.toString();
  }

  const sign = number < 0 ? "-" : "";
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
    compactDisplay: "short",
  });

  return sign + formatter.format(absNumber);
};

// Alternative implementation without using Intl
export const formatCompactNumberManual = (number: number): string => {
  const absNumber = Math.abs(number);
  const sign = number < 0 ? "-" : "";

  if (absNumber < 1000) {
    return sign + absNumber.toString();
  }

  const suffixes = ["", "K", "M", "B"];
  const magnitude = Math.min(3, Math.floor(Math.log10(absNumber) / 3));
  const scaled = absNumber / Math.pow(1000, magnitude);
  const formatted =
    scaled >= 100
      ? Math.round(scaled).toString()
      : scaled.toFixed(1).replace(/\.0$/, "");

  return sign + formatted + suffixes[magnitude];
};

// If you need more precise control over the output format:
type FormatOptions = {
  /** Maximum number of decimal places */
  decimals?: number;
  /** Whether to show decimal places for round numbers */
  forceDecimals?: boolean;
};

export const formatCompactNumberWithOptions = (
  number: number,
  options: FormatOptions = {}
): string => {
  const { decimals = 1, forceDecimals = false } = options;

  const absNumber = Math.abs(number);
  const sign = number < 0 ? "-" : "";

  if (absNumber < 1000) {
    return sign + absNumber.toString();
  }

  const suffixes = ["", "K", "M", "B"];
  const magnitude = Math.min(3, Math.floor(Math.log10(absNumber) / 3));
  const scaled = absNumber / Math.pow(1000, magnitude);

  let formatted: string;
  if (scaled >= 100) {
    formatted = Math.round(scaled).toString();
  } else {
    formatted = scaled.toFixed(decimals);
    if (!forceDecimals) {
      formatted = formatted.replace(/\.0+$/, "");
    }
  }

  return sign + formatted + suffixes[magnitude];
};
