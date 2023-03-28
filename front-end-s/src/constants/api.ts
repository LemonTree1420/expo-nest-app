export const API_HEADER = (token: string) => {
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return header;
};
