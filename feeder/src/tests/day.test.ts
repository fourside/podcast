import assert from "node:assert";
import { describe, it } from "node:test";
import { formatRfc822 } from "../day";

describe("date", () => {
  describe("formatRfc822", () => {
    it("should format Date", () => {
      // arrange
      const day = new Date(2022, 0, 1, 2, 3, 4);
      // act
      const result = formatRfc822(day);
      // assert
      assert.equal(result, "Sat, 01 Jan 2022 02:03:04 +0900");
    });
  });
});
