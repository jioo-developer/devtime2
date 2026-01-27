export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
};
