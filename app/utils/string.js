export const randomString = (n) => {
  return Math.random().toString(36).slice(-1 * n);
};
