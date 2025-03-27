import { Session } from "../levels/types.js";
import { Devvit } from "@devvit/public-api";

export const HelpScreen = ({ session }: { session: Session }): JSX.Element => {
    if (!session.level.help) {
        return (
            <hstack height="100%" width="100%" padding="large">
                <text size="small" maxWidth={100} width={100} height={100} wrap>
                    {"No background info available, sorry :/"}
                </text>
            </hstack>
        );
    }
    const lines = session.level.help.split("\n");
    const firstLine = lines.shift(); // Extract the first line
    const restOfText = lines.join("\n"); // Join the remaining lines back together
    return (
        <vstack height="100%" width="100%" padding="large">
            <text style="heading" maxWidth={100} width={100} wrap>
                {firstLine}
            </text>
            <text size="small" maxWidth={100} width={100} height={100} wrap>
                {restOfText}
            </text>
        </vstack>
    );
};
