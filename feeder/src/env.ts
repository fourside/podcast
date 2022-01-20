export const Env = {
  getPort(): number {
    const port = process.env.PORT;
    return port === undefined ? 3000 : parseInt(port, 10);
  },
  getAllowedUser(): string {
    const user = process.env.USER;
    if (user === undefined) {
      throw new Error("USER environment variable is not set");
    }
    return user;
  },
  getAllowedPassword(): string {
    const password = process.env.PASSWORD;
    if (password === undefined) {
      throw new Error("PASSWORD environment variable is not set");
    }
    return password;
  },
  getEnv(): "production" | "development" {
    return process.env.NODE_ENV === "production" ? "production" : "development";
  }
}
