import { formatDateTime } from "./date.ts";
import { getLogger } from "./logger.ts";

export async function sendMessageToSlack(
  webhookUrl: string,
  message: string,
  programInfo: { title: string; artist: string } | undefined,
): Promise<void> {
  const blocks = buildBlockKit(
    "Failure of recording",
    programInfo,
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
  const logger = getLogger("common");
  logger.info("Send Slack response.", response);
}

function buildBlockKit(
  headerText: string,
  programInfo: { title: string; artist: string } | undefined,
  message: string,
  date: Date,
): Blocks {
  const additionalInfo = programInfo === undefined
    ? ""
    : `\n*${programInfo.title}*/*${programInfo.artist}*`;
  const headerTextBlock: SectionBlock = {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `${headerText}${additionalInfo}`,
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
    blocks: [headerTextBlock, messageBlock, dateContextBlock],
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
