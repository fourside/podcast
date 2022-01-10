import { assert, assertEquals } from "std/testing";
import { parseArgs } from "./cli.ts";

Deno.test("-h", () => {
  // arrange
  const args = ["-h"];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, true);
  assert(result.exit === true);
  assertEquals(result.exitCode, 0);
});

Deno.test("--help", () => {
  // arrange
  const args = ["--help"];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, true);
  assert(result.exit === true);
  assertEquals(result.exitCode, 0);
});

Deno.test("-v", () => {
  // arrange
  const args = ["-v"];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, true);
  assert(result.exit === true);
  assertEquals(result.exitCode, 0);
});

Deno.test("--version", () => {
  // arrange
  const args = ["--version"];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, true);
  assert(result.exit === true);
  assertEquals(result.exitCode, 0);
});

Deno.test("normal long option", () => {
  // arrange
  const args = [
    "--station",
    "TBS",
    "--duration",
    "60",
    "--title",
    "タイトル1",
    "--artist",
    "アーティスト1",
  ];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, false);
  assert(result.exit === false);
  assertEquals(result.station, "TBS");
  assertEquals(result.duration, 60);
  assertEquals(result.title, "タイトル1");
  assertEquals(result.artist, "アーティスト1");
  assertEquals(result.timeFree, false);
});

Deno.test("normal short option", () => {
  // arrange
  const args = ["-s", "QRR", "-d", "120", "-t", "タイトル2", "-a", "アーティスト2"];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, false);
  assert(result.exit === false);
  assertEquals(result.station, "QRR");
  assertEquals(result.duration, 120);
  assertEquals(result.title, "タイトル2");
  assertEquals(result.artist, "アーティスト2");
  assertEquals(result.timeFree, false);
});

Deno.test("duration not number", () => {
  // arrange
  const args = ["-s", "TBS", "-d", "aaa", "-t", "タイトル", "-a", "アーティスト"];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, true);
  assert(result.exit === true);
  assertEquals(result.exitCode, -1);
});

Deno.test("timefree", () => {
  // arrange
  const args = [
    "timefree",
    "-s",
    "TBS",
    "-d",
    "30",
    "-t",
    "タイトル",
    "-a",
    "アーティスト",
    "-f",
    "201901011200",
  ];
  // act
  const result = parseArgs(args);

  // assert
  assertEquals(result.exit, false);
  assert(result.exit === false);
  assert(result.timeFree === true);
  assertEquals(result.timeFree, true);
  assertEquals(result.station, "TBS");
  assertEquals(result.duration, 30);
  assertEquals(result.title, "タイトル");
  assertEquals(result.artist, "アーティスト");
  assertEquals(result.fromTime, "201901011200");
});
