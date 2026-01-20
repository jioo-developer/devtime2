export const ApiClient = {
  config: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  },
};
