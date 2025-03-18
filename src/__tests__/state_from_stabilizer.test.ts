import { TestLevel } from "../levels/simplest.js";
import { KetMinus, KetOne, KetPlus, KetZero, Stabilizer } from "../types.js";
import { stateFromStabilizer } from "../utils.js";

describe('State from stabilizer test', () => {
    test('Basic example gets assigned correct input state', () => {
        const inputStabilizer = TestLevel.inputState;
        const computedState = stateFromStabilizer(inputStabilizer);
        expect(computedState[0]).toBe(KetZero);
        expect(computedState[1]).toBe(KetZero);
    });
    test('Ket Ones are correctly identified', () => {
        const inputStabilizer = [
            new Stabilizer(-1, [0, 0], [1, 0]),
            new Stabilizer(-1, [0, 0], [0, 1]),
        ];
        const computedState = stateFromStabilizer(inputStabilizer);
        expect(computedState[0]).toBe(KetOne);
        expect(computedState[1]).toBe(KetOne);
    });
    test('Ket Minus and Plus are correctly identified', () => {
        const inputStabilizer = [
            new Stabilizer(1, [1, 0], [0, 0]),
            new Stabilizer(-1, [0, 1], [0, 0]),
        ];
        const computedState = stateFromStabilizer(inputStabilizer);
        expect(computedState[0]).toBe(KetPlus);
        expect(computedState[1]).toBe(KetMinus);
    });
})
