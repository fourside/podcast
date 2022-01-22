import * as fs from "fs";
import * as path from "path";
import { Env } from "./env";

export type PodcastFile = {
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  mtime: Date;
};

export function getPodcastFiles(dir: string, ext = ".mp3"): PodcastFile[] {
  if (Env.getEnv() === "development") {
    generateMockData(dir);
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(ext))
    .map<PodcastFile>((dirent) => {
      const basename = path.basename(dirent.name, ext);
      const filePath = path.join(dir, dirent.name);
      const stats = fs.statSync(filePath);
      return {
        title: basename,
        description: basename,
        fileName: `${basename}${ext}`,
        fileSize: stats.size,
        mtime: stats.mtime,
      };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

/**
 * 開発環境でモックデータ用ディレクトリがないときはファイル生成する
 * @returns
 */
function generateMockData(dir: string): void {
  if (Env.getEnv() !== "development") {
    return;
  }
  if (fs.existsSync(dir)) {
    return;
  }
  fs.mkdirSync(dir);
  ["file-1", "file-2", "file-3", "ファイル1"].forEach((fileName, index) => {
    const suffix = `${new Date().getFullYear()}${new Date().getMonth() + 1}${
      new Date().getDate()
    }`;
    fs.writeFileSync(path.join(dir, `${fileName}-${suffix}.mp3`), "test");
    const atime = new Date(Date.now() - 1000 * 60 * 24);
    const mtime = new Date(Date.now() + 1000 * 60 * 24 * index);
    fs.utimesSync(path.join(dir, `${fileName}-${suffix}.mp3`), atime, mtime);
  });
}
