import { Devvit, StateSetter } from "@devvit/public-api";

type SuccessPopupProps = {
    visible: boolean;
    close: () => void;
    text?: string;
};

const MotivationalQuotes = ["Quantum victory unlocked!"];

export const SuccessPopup = (props: SuccessPopupProps): JSX.Element => {
    if (!props.visible) return "";
    return (
        <vstack
            height="30%"
            minHeight="90px"
            width="80%"
            alignment="top center"
            backgroundColor="KiwiGreen-400"
            cornerRadius="medium"
        >
            <hstack
                width="100%"
                height="50px"
                alignment="middle end"
                padding="small"
            >
                <button appearance="plain" icon="close" onPress={props.close} />
            </hstack>
            <vstack grow alignment="middle center">
                <text
                    alignment="center"
                    size="xxlarge"
                    weight="bold"
                    color="black"
                    maxWidth={100}
                    width={100}
                    height={100}
                    wrap
                >
                    {props.text ??
                        MotivationalQuotes[
                            Math.floor(
                                Math.random() * MotivationalQuotes.length,
                            )
                        ]}
                </text>
            </vstack>
        </vstack>
    );
};
