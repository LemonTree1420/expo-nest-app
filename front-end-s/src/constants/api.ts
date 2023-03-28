export const API_URL = "http://13.209.57.85:9001/";
export const API_HEADER = (token: string) => {
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return header;
};
