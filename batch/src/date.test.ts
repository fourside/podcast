import { assertEquals } from "std/testing";
import {
  formatTimeForFfmpeg,
  getDateIfMidnightThenSubtracted,
} from "./date.ts";

Deno.test("夜中でなければ同じDate", () => {
  // arrange
  const date = new Date(2022, 1, 20, 15, 30, 15);
  // act
  const result = getDateIfMidnightThenSubtracted(date);
  // assert
  assertEquals(result, date);
});

Deno.test("夜中であれば前日", () => {
  // arrange
  const date = new Date(2022, 1, 20, 0, 30, 15);
  // act
  const result = getDateIfMidnightThenSubtracted(date);
  // assert
  assertEquals(result.getFullYear(), date.getFullYear());
  assertEquals(result.getMonth(), date.getMonth());
  assertEquals(result.getDate(), date.getDate() - 1);
  assertEquals(result.getHours(), date.getHours());
  assertEquals(result.getMinutes(), date.getMinutes());
});

Deno.test("夜中で月初なら前月になる", () => {
  // arrange
  const date = new Date(2022, 2, 1, 1, 30, 15);
  // act
  const result = getDateIfMidnightThenSubtracted(date);
  // assert
  const lastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate(); // 前月の月初
  assertEquals(result.getFullYear(), date.getFullYear());
  assertEquals(result.getMonth(), date.getMonth() - 1);
  assertEquals(result.getDate(), lastDate);
  assertEquals(result.getHours(), date.getHours());
  assertEquals(result.getMinutes(), date.getMinutes());
});

Deno.test("夜中で年初なら前年になる", () => {
  // arrange
  const date = new Date(2022, 0, 1, 1, 30, 15);
  // act
  const result = getDateIfMidnightThenSubtracted(date);
  // assert
  assertEquals(result.getFullYear(), date.getFullYear() - 1);
  assertEquals(result.getMonth(), 11);
  assertEquals(result.getDate(), 31);
  assertEquals(result.getHours(), date.getHours());
  assertEquals(result.getMinutes(), date.getMinutes());
});

Deno.test("FFMPEG用のtimeフォーマット", () => {
  // arrange
  const duration = 150;
  // act
  const result = formatTimeForFfmpeg(duration);
  // assert
  assertEquals(result, "023000");
});
