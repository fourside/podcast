import { formatDateTime } from "./date.ts";

export async function sendMessageToSlack(
  message: string,
  title: string,
  artist: string,
): Promise<void> {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (webhookUrl === undefined) {
    throw new Error("SLACK_WEBHOOK_URL is not passed.");
  }
  const blocks = buildBlockKit(
    "Failure of recording",
    title,
    artist,
    message,
    new Date(),
  );
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blocks),
  });
  console.log("Send Slack response.", response);
}

function buildBlockKit(
  headerText: string,
  title: string,
  artist: string,
  message: string,
  date: Date,
): Blocks {
  const titleAndArtistBlock: SectionBlock = {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `${headerText}\n*${title}*/*${artist}*`,
    },
  };
  const messageBlock: SectionBlock = {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "```" + message + "```",
    },
  };
  const dateContextBlock: ContextBlock = {
    "type": "context",
    "elements": [
      {
        "type": "plain_text",
        "text": formatDateTime(date),
      },
    ],
  };
  return {
    blocks: [titleAndArtistBlock, messageBlock, dateContextBlock],
  };
}

type Blocks = {
  blocks: (SectionBlock | ContextBlock)[];
};

type SectionBlock = {
  type: "section";
  text: {
    type: "plain_text" | "mrkdwn";
    text: string;
  };
};

type ContextBlock = {
  type: "context";
  elements: {
    type: "plain_text";
    text: string;
  }[];
};
