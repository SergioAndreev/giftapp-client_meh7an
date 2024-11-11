export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, "");
}

export function isNumericString(str: string): boolean {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function transformFormData(
  formData: Record<string, string>
): Record<string, string | number> {
  return Object.entries(formData).reduce((acc, [key, value]) => {
    const camelKey = toCamelCase(key);
    const transformedValue = isNumericString(value) ? Number(value) : value;
    return { ...acc, [camelKey]: transformedValue };
  }, {});
}

export const inputType = (value: string) => {
  if (value.startsWith("number")) {
    if (value === "number+0")
      return { type: "number", min: 0, inputMode: "numeric" as const };
    else if (value === "number")
      return { type: "number", inputMode: "numeric" as const };
  }
  if (value === "string") {
    return { type: "text", inputMode: "text" as const };
  }
  if (value.startsWith("file:"))
    return { type: "file", accept: value.split(":")[1] };
  return { type: "text", inputMode: "text" as const };
};
