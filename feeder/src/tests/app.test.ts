import assert from "assert";
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
    process.env.USER = "user";
    process.env.PASSWORD = "password";
    const app = buildApp();
    // act
    const response = await app.inject({
      method: "GET",
      url: "/feed",
      headers: {
        authorization: "Basic " + Buffer.from("user:password").toString("base64"),
      },
    });
    // assert
    assert.equal(response.statusCode, 200);
  });
});
