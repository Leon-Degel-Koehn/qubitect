import { gateLayout } from "../ui/helper.js";
import { TestLevel } from "../levels/simplest.js";
import { Hadamard, Identity, PauliX, PlaceholderGate } from "../types.js";

describe('Gate layout tests', () => {
    test('Basic example is layed out correctly', () => {
        const layout = gateLayout(TestLevel);
        expect(layout[0][0]).toBeInstanceOf(PauliX);
        expect(layout[0][1]).toBeInstanceOf(Hadamard);
        expect(layout[1][0]).toBeInstanceOf(Identity);
        expect(layout[1][1]).toBeInstanceOf(PlaceholderGate);
        expect(layout[2][0]).toBeInstanceOf(Identity);
        expect(layout[2][1]).toBeInstanceOf(Hadamard);
    });
})
