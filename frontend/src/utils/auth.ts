export const getAuth = () => {
  const data = localStorage.getItem("user");

  if (!data) return null;

  return JSON.parse(data);
};