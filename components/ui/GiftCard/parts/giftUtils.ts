export const hexToBase64 = (hexString: string) =>
  btoa(
    (hexString.match(/\w{2}/g) ?? [])
      .map((a) => String.fromCharCode(parseInt(a, 16)))
      .join("")
  );

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return date
    .toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " at");
};
