export const parseJSON = (maybeJSON: string, fallback = {}) => {
  try {
    return JSON.parse(maybeJSON);
  } catch {
    return fallback;
  }
};
