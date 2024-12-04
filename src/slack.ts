import { getLastCommit } from "git-last-commit";
import { promisify } from "util";
const lastCommit = await promisify(getLastCommit)();
import { version as pkgVersion } from "../package.json";
// light interface of slack blocks
export interface SlackBlock {
  type: string;
  text?: {
    type: "plain_text" | "mrkdwn" ;
    text: string;
    emoji?: boolean;
  };
  elements?: {
    type: "mrkdwn" | "context";
    text: string;
  }[];
}
export function getSlackBlocks(diffs: string[]) {
  if (diffs.length === 0) return;
  let blocks:SlackBlock[] = [];
  blocks.push({
    type: "header",
    text: {
      type: "plain_text",
      text: "Changes detected in the shop",
      emoji: true,
    },
  });
  for (const diff of diffs) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: diff,
      },
    });
    blocks.push({
      type: "divider",
    });
  }
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `high-seas-monitor v${pkgVersion} • commit ${lastCommit.shortHash}`,
      },
    ],
  });
  return {
    blocks,
  };
}
