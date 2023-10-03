import path from "path/posix";

export const Env = {
  getPort(): number {
    const port = process.env.PORT;
    return port === undefined ? 3000 : Number.parseInt(port, 10);
  },
  getFeederUser(): string {
    return process.env.FEEDER_USER || unreachable("FEEDER_USER");
  },
  getFeederPassword(): string {
    return process.env.FEEDER_PASSWORD || unreachable("FEEDER_PASSWORD");
  },
  getEnv(): "production" | "development" {
    return process.env.NODE_ENV === "production" ? "production" : "development";
  },
  getFileDir(): string {
    return process.env.NODE_ENV === "production" ? "/public" : "./mock-data";
  },
  getDistDir(): string {
    return path.join(__dirname, "../dist");
  },
};

function unreachable(name: string): never {
  throw new Error(`${name} is not set.`);
}
