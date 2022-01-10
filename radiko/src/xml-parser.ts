import { parse } from "x/xml";
import { RecRadikoError } from "./rec-radiko-error.ts";

type PlaylistUrl = string;

export function getPlaylistUriFromXml(xml: string): PlaylistUrl {
  const parsedXml = parse(xml);
  const urls = parsedXml.urls;
  if (!isNode(urls)) {
    throw new RecRadikoError("urls is not found");
  }
  const urlList = urls.url;
  if (!Array.isArray(urlList)) {
    throw new RecRadikoError("urls is not found");
  }
  const areaFreeUrls = urlList.filter((url) => url["@areafree"] === 0);
  const targetUrl = areaFreeUrls[0];
  if (!isNode(targetUrl)) {
    throw new RecRadikoError("area-free second url is not found");
  }

  const playListUrl = targetUrl.playlist_create_url;
  if (typeof playListUrl !== "string") {
    throw new RecRadikoError("playlist_create_url is not found");
  }
  return playListUrl;
}

function isNode(node: unknown): node is Node {
  return typeof node !== "string" && typeof node !== "number" &&
    typeof node !== "boolean" && node !== null && node !== undefined;
}

type Node = {
  [key: PropertyKey]: unknown;
};
