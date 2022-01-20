import assert from "assert";
import { formatRfc822 } from "../day";

describe('day', () => {
  describe('formatRfc822', () => {
    it('should format Date', () => {
      // arrange
      const day = new Date(2022, 0, 1, 2, 3, 4);
      // act
      const result = formatRfc822(day);
      // assert
      assert.equal(result, "Sat, 01 Jan 2022 02:03:04 +0900");
    });
  });
});
