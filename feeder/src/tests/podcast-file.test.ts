import assert from "assert";
import * as fs from "fs";
import { getPodcastFiles } from "../podcast-file";

describe("getPodcastFiles", () => {
  const dir = "./test-files";
  const fileNames = [`${dir}/test-a.mp3`, `${dir}/test-b.mp3`, `${dir}/test-c.mp3`];

  before(() => {
    fileNames.forEach((fileName) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fs.unlink(fileName, () => {});
    });
    fs.mkdirSync(dir);
    fileNames.forEach((fileName, index) => {
      fs.writeFileSync(fileName, "test");
      const atime = new Date(Date.now() - 1000 * 60 * 24);
      const mtime = new Date(Date.now() + 1000 * 60 * 24 * index);
      fs.utimesSync(fileName, atime, mtime);
    });
  });

  it("file is sorted by mtime", () => {
    // arrange & act
    const resultFiles = getPodcastFiles(dir);
    // assert
    assert.equal(resultFiles.length, 3);
    // assert as sorted
    assert.equal(resultFiles[0].title, "test-c");
    assert.equal(resultFiles[1].title, "test-b");
    assert.equal(resultFiles[2].title, "test-a");
  });

  after(() => {
    fileNames.forEach((fileName) => {
      fs.unlinkSync(fileName);
    });
    fs.rmdirSync(dir);
  });
});
