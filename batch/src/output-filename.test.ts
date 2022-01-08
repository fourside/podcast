import { assertEquals } from "std/testing";
import { getOutputFilename } from "./output-filename.ts";

Deno.test("ファイル名のフォーマット", () => {
  // arrange
  const title = "title";
  const date = new Date(2022, 0, 1, 15, 30, 15);
  // act
  const result = getOutputFilename(title, date);
  // assert
  assertEquals(result, "title-20220101.mp3");
});
