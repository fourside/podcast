import { assertEquals } from "std/assert";
import { getPlaylistUriFromXml } from "./xml-parser.ts";

Deno.test("parse xml and get uri", () => {
  // arrange
  const xml = `
<?xml version="1.0" encoding="UTF-8" ?>
<urls>
  <url areafree="0">
    <media_url_path></media_url_path>
    <playlist_create_url>http://f-radiko.smartstream.ne.jp/TBS/_definst_/simul-stream.stream/playlist.m3u8</playlist_create_url>
    <playlist_url_path></playlist_url_path>
  </url>
  <url areafree="0">
    <media_url_path />  <playlist_create_url>https://radiko.jp/v2/api/playlist_create/TBS?l=300</playlist_create_url>
    <playlist_url_path /></url>
  <url areafree="1">
    <media_url_path />  <playlist_create_url>http://c-radiko.smartstream.ne.jp/TBS/_definst_/simul-stream.stream/playlist.m3u8</playlist_create_url>
    <playlist_url_path /></url>
  <url areafree="1">
    <media_url_path></media_url_path>
    <playlist_create_url>http://c-radiko.smartstream.ne.jp/TBS/_definst_/simul-stream.stream/playlist.m3u8</playlist_create_url>
    <playlist_url_path></playlist_url_path>
  </url>
</urls>
`;
  // act
  const result = getPlaylistUriFromXml(xml);
  // assert
  assertEquals(
    result,
    "http://f-radiko.smartstream.ne.jp/TBS/_definst_/simul-stream.stream/playlist.m3u8",
  );
});
