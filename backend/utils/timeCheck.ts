export const isWithinTime = (start: string, end: string) => {
  const now = new Date();

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(sh, sm, 0);

  const endDate = new Date();
  endDate.setHours(eh, em, 0);

  return now >= startDate && now <= endDate;
};
