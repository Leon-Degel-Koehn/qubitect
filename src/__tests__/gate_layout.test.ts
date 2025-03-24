import { gateLayout } from "../ui/helper.js";
import { TestLevel } from "../levels/simplest.js";
import { Hadamard, Identity, PauliX, PlaceholderGate } from "../types.js";
import { Session } from "../levels/types.js";

describe("Gate layout tests", () => {
    test("Basic example is layed out correctly", () => {
        const layout = gateLayout(new Session(TestLevel));
        expect(layout[0][0]["gate"]).toBeInstanceOf(PauliX);
        expect(layout[0][1]["gate"]).toBeInstanceOf(Hadamard);
        expect(layout[1][0]["gate"]).toBeInstanceOf(Identity);
        expect(layout[1][1]["gate"]).toBeInstanceOf(PlaceholderGate);
        expect(layout[2][0]["gate"]).toBeInstanceOf(Identity);
        expect(layout[2][1]["gate"]).toBeInstanceOf(Hadamard);
    });
});
