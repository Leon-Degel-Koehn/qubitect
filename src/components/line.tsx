import { Devvit } from "@devvit/public-api";

export enum Direction {
    Vertical,
    Horizontal,
}

type LineProps = {
    length: number;
    lengthRelative?: boolean;
    thickness: number;
    thicknessRelative?: boolean;
    direction: Direction;
};

export const Line = (props: LineProps): JSX.Element => {
    if (props.direction === Direction.Vertical)
        return (
            <hstack
                backgroundColor="black"
                width={`${props.thickness}${props.thicknessRelative ? "%" : "px"}`}
                height={`${props.length}${props.lengthRelative ? "%" : "px"}`}
            />
        );
    else
        return (
            <hstack
                backgroundColor="black"
                width={`${props.length}${props.lengthRelative ? "%" : "px"}`}
                height={`${props.thickness}${props.thicknessRelative ? "%" : "px"}`}
            />
        );
};
