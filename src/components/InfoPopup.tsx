import { Devvit } from "@devvit/public-api";

type InfoPopupProps = {
    visible: boolean;
    setVisible: (visibility: boolean) => void;
    text: string;
};

export const InfoPopup = (props: InfoPopupProps): JSX.Element => {
    if (!props.visible) return "";
    const lines = props.text.split("\n");
    const firstLine = lines.shift(); // Extract the first line
    const restOfText = lines.join("\n"); // Join the remaining lines back together
    return (
        <vstack
            height="70%"
            width="70%"
            alignment="top center"
            backgroundColor="CoolGray-900"
            cornerRadius="medium"
            padding="small"
        >
            <hstack width="100%" height="50px" alignment="middle end">
                <button
                    appearance="plain"
                    icon="close"
                    onPress={() => {
                        props.setVisible(false);
                    }}
                />
            </hstack>
            <text style="heading" maxWidth={100} width={100} wrap>
                {firstLine}
            </text>
            <spacer size="small" />
            <text size="small" maxWidth={100} width={100} height={100} wrap>
                {restOfText}
            </text>
        </vstack>
    );
};
