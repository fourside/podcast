import assert from "node:assert";
import { describe, it } from "node:test";
import { buildApp } from "../app";

describe("app", () => {
  it("should guard by authentication", async () => {
    // arrange
    const app = buildApp();
    // act
    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    // assert
    assert.equal(response.statusCode, 401);
  });

  it("should response by authenticated user", async () => {
    // arrange
    process.env.FEEDER_USER = "test_user";
    process.env.FEEDER_PASSWORD = "test_password";
    const app = buildApp();
    // act
    const response = await app.inject({
      method: "GET",
      url: "/feed",
      headers: {
        authorization: "Basic " + Buffer.from("test_user:test_password").toString("base64"),
      },
    });
    // assert
    assert.equal(response.statusCode, 200, response.body);
  });
});
