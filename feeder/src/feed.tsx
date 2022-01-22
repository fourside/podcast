import { ReactElement } from "react";
import { formatRfc822 } from "./day";
import { Env } from "./env";
import { getPodcastFiles } from "./podcast-file";

interface Props {
  baseUrl: string;
}

export function Feed(props: Props): ReactElement<Props> {
  const files = getPodcastFiles(Env.getFileDir());
  return (
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <description>private podcast</description>
        <title>private podcast</title>
        <pubDate>{formatRfc822(new Date())}</pubDate>
        {files.map((item, index) => (
          <item key={index}>
            <title>{item.title}</title>
            <description>{item.description}</description>
            <enclosure
              url={`${props.baseUrl}/mp3/${encodeURI(item.fileName)}`}
              length={item.fileSize}
              type={"audio/mpeg"}
            />
            <pubDate>{formatRfc822(item.mtime)}</pubDate>
          </item>
        ))}
      </channel>
    </rss>
  );
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }
  }
}
