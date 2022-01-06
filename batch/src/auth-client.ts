import { encode } from "std/encoding/base64";
import { RecRadikoError } from "./rec-radiko-error.ts";

type RadikoToken = string;

//   Define authorize key value (from http://radiko.jp/apps/js/playerCommon.js)
const RADIKO_AUTHKEY_VALUE = "bcd151073c03b352e1ef2fd66c32209da9ca0afa";

type Auth1Headers = {
  "authToken": string;
  "keyOffset": string;
  "keyLength": string;
};

export async function authorize(): Promise<RadikoToken> {
  // Authorize 1
  const auth1Response = await fetch("https://radiko.jp/v2/api/auth1", {
    headers: {
      "X-Radiko-App": "pc_html5",
      "X-Radiko-App-Version": "0.0.1",
      "X-Radiko-Device": "pc",
      "X-Radiko-User": "dummy_user",
    },
  });

  const auth1Headers = Array.from(auth1Response.headers).reduce<
    Partial<Auth1Headers>
  >(
    (acc, [key, value]) => {
      if (key.toLowerCase() === "x-radiko-authtoken") {
        acc["authToken"] = value;
      }
      if (key.toLowerCase() === "x-radiko-keyoffset") {
        acc["keyOffset"] = value;
      }
      if (key.toLowerCase() === "x-radiko-error-keylength") {
        acc["keyLength"] = value;
      }
      return acc;
    },
    {},
  );
  if (
    auth1Headers.authToken === undefined ||
    auth1Headers.keyOffset === undefined ||
    auth1Headers.keyLength === undefined
  ) {
    console.error(auth1Headers);
    throw new RecRadikoError("auth1 response is invalid");
  }
  const keyOffset = parseInt(auth1Headers.keyOffset, 10);
  const keyLength = parseInt(auth1Headers.keyLength, 10);
  if (isNaN(keyOffset) || isNaN(keyLength)) {
    console.error({ keyOffset, keyLength });
    throw new RecRadikoError("keyOffset or keyLength is not a number");
  }

  const partialKey = encode(
    RADIKO_AUTHKEY_VALUE.substring(keyOffset, keyLength),
  );

  // # Authorize 2
  const auth2Response = await fetch("https://radiko.jp/v2/api/auth2", {
    headers: {
      "X-Radiko-Device": "pc",
      "X-Radiko-User": "dummy_user",
      "X-Radiko-AuthToken": auth1Headers.authToken,
      "X-Radiko-PartialKey": partialKey,
    },
  });
  if (!auth2Response.ok) {
    console.error(auth2Response);
    throw new RecRadikoError("auth2 response is not ok");
  }

  return auth1Headers.authToken;
}
