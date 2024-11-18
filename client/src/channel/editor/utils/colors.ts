const COLORS = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];

export const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};
