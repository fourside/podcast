import { execFile } from "child_process";
import { promisify } from "util";

export type DiscFreeOfDevDevice = {
  name: string;
  availableBytes: number;
};

export async function getDiscFreeOfDevDevice(): Promise<DiscFreeOfDevDevice[]> {
  const { stdout } = await promisify(execFile)("df");
  // Filesystem     1K-blocks      Used Available Use% Mounted on
  // /dev/aaa               0         0         2  19% /
  return stdout
    .split("\n")
    .slice(1) // remove header
    .filter((line) => line.startsWith("/dev"))
    .map<DiscFreeOfDevDevice>((line) => {
      const columns = line.split(/ +/);
      return {
        name: columns[0],
        availableBytes: parseInt(columns[3], 10),
      };
    })
    .sort((a, b) => b.availableBytes - a.availableBytes);
}
