export const getRankColor = (rank: number) => {
  const topColors = {
    1: "#F1AA05",
    2: "#a0a0a0",
    3: "#CD7F32",
  };
  return topColors[rank as keyof typeof topColors];
};
