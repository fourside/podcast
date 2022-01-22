export const Env = {
  getPort(): number {
    const port = process.env.PORT;
    return port === undefined ? 3000 : parseInt(port, 10);
  },
  getFeederUser(): string {
    const user = process.env.FEEDER_USER;
    if (user === undefined) {
      throw new Error("FEEDER_USER environment variable is not set");
    }
    return user;
  },
  getFeederPassword(): string {
    const password = process.env.FEEDER_PASSWORD;
    if (password === undefined) {
      throw new Error("FEEDER_PASSWORD environment variable is not set");
    }
    return password;
  },
  getEnv(): "production" | "development" {
    return process.env.NODE_ENV === "production" ? "production" : "development";
  },
  getFileDir(): string {
    return process.env.NODE_ENV === "production" ? "/public" : "./mock-data";
  },
};
