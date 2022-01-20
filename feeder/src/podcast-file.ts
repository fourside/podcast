import * as fs from "fs";
import * as path from "path";

export type PodcastFile = {
  title: string;
  description: string;
  filePath: string;
  fileSize: number;
  mtime: Date;
};

export function getPodcastFiles(dir: string, ext = ".mp3"): PodcastFile[] {
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
        filePath: path.join(dir, dirent.name),
        fileSize: stats.size,
        mtime: stats.mtime,
      };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}
