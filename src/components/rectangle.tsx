import { Devvit } from "@devvit/public-api";

type RectProperties = {
    width: number;
    height: number;
    backgroundColor: string;
};

export const Rect = (props: RectProperties): JSX.Element => {
    return (
        <hstack
            width={`${props.width}px`}
            height={`${props.height}px`}
            backgroundColor={props.backgroundColor}
        ></hstack>
    );
};
