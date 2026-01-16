export const ApiClient = {
  config: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  },
};

export const ApiEndpoints = {
  signup: {
    checkEmail:
      process.env.NEXT_PUBLIC_API_CHECK_EMAIL || "/api/signup/check-email",
    checkNickname:
      process.env.NEXT_PUBLIC_API_CHECK_NICKNAME ||
      "/api/signup/check-nickname",
    register: process.env.NEXT_PUBLIC_API_SIGNUP || "/api/signup",
  },
};
