export const routes = {
  auth: {
    home: "/auth",
    createNewPassword: (username: string) => `/auth/create-password?username=${username}`,
  },
  home: {
    home: "/",
  },
};
