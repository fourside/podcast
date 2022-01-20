import { ReactElement } from "react";
import { getPodcastFiles } from "./podcast-file";

export function Feed(): ReactElement {
  const files = getPodcastFiles(process.env.NODE_ENV === "production" ? "/public" : "./mock-data");
  return (
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <description>private podcast</description>
        <title>private podcast</title>
        <pubDate>{new Date().toString()}</pubDate>
        {files.map((item, index) => (
          <item key={index}>
            <title>{item.title}</title>
            <description>{item.description}</description>
            <enclosure url={encodeURI(item.filePath)} length={item.fileSize} type={"audio/mpeg"} />
            <pubDate>{item.mtime.toString()}</pubDate>
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
