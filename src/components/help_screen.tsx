import { Session } from "../levels/types.js";
import { Devvit } from "@devvit/public-api";

export const HelpScreen = ({ session }: { session: Session }): JSX.Element => {
  return (
    <hstack height="100%" width="100%" padding="large">
      <text size="small" maxWidth={100} width={100} height={100} wrap>
        {session.level.help || "No background info available, sorry :/"}
      </text>
    </hstack>
  )
}
