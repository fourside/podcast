type PlaylistXml = string;

export async function getPlaylistXml(station: string): Promise<PlaylistXml> {
  const response = await fetch(
    `http://radiko.jp/v2/station/stream_smh_multi/${station}.xml`,
  );
  return await response.text();
}
