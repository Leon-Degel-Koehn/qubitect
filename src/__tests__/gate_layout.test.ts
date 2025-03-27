import { gateLayout } from "../ui/helper.js";
import { ControlledPauliX, Hadamard, Identity } from "../types.js";
import { Session } from "../levels/types.js";
import { BellstatePreparation } from "../levels/bell_state_preparation.js";

describe("Gate layout tests", () => {
    test("CNOT is layed out correctly", () => {
        const lvl = BellstatePreparation;
        lvl.greyedOutIndices = [];
        const layout = gateLayout(new Session(lvl));
        expect(layout[0][0]["gate"]).toBeInstanceOf(Hadamard);
        expect(layout[0][1]["gate"]).toBeInstanceOf(Identity);
        expect(layout[1][0]["gate"]).toBeInstanceOf(ControlledPauliX);
        expect(layout[1][1]["gate"]).toBeInstanceOf(ControlledPauliX);
    });
});
