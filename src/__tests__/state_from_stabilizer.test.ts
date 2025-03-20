import { TestLevel } from "../levels/simplest.js";
import { KetBellPlus, KetMinus, KetOne, KetPlus, KetZero, Stabilizer, UnknownKetState } from "../types.js";
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
    test('Bell states are correctly identified', () => {
        const inputStabilizer = KetBellPlus.stabilizer;
        const computedState = stateFromStabilizer(inputStabilizer);
        expect(computedState).toEqual([KetBellPlus]);
    });
    test('Combinations of multi- and single-qubit states work', () => {
        const oneStabilizer = KetOne.stabilizer.map((s) => s.onQubits([0], 5));
        const bellStabilizer = KetBellPlus.stabilizer.map((s) => s.onQubits([1, 2], 5));
        const zeroStabilizer = KetZero.stabilizer.map((s) => s.onQubits([3], 5));
        const plusStabilizer = KetPlus.stabilizer.map((s) => s.onQubits([4], 5));
        const inputStabilizer = oneStabilizer.concat(bellStabilizer, zeroStabilizer, plusStabilizer);
        const computedState = stateFromStabilizer(inputStabilizer);
        expect(computedState).toEqual([KetOne, KetBellPlus, KetZero, KetPlus]);
    });
    test('Combinations of bell states work', () => {
        const s1 = KetBellPlus.stabilizer.map((s) => s.onQubits([0, 1], 4));
        const s2 = KetBellPlus.stabilizer.map((s) => s.onQubits([2, 3], 4));
        const inputStabilizer = s1.concat(s2);
        const computedState = stateFromStabilizer(inputStabilizer);
        expect(computedState).toEqual([KetBellPlus, KetBellPlus]);
    });
    test('Partially unknown states are correctly resolved', () => {
        const inputStabilizer = [
            new Stabilizer(1, [1, 0], [1, 0]),
            new Stabilizer(-1, [0, 1], [0, 0]),
        ];
        const computedState = stateFromStabilizer(inputStabilizer);
        console.log(computedState);
        expect(computedState[0]).toBe(UnknownKetState);
        expect(computedState[1]).toBe(KetMinus);
    });
    test('Complex partially unknown states are correctly resolved', () => {
        const oneStabilizer = KetOne.stabilizer.map((s) => s.onQubits([0], 5));
        const unknownOne = [new Stabilizer(1, [0, 1, 0, 0, 0], [0, 1, 0, 0, 0])];
        const bellStabilizer = KetBellPlus.stabilizer.map((s) => s.onQubits([2, 3], 5));
        const unknownTwo = [new Stabilizer(1, [0, 0, 0, 0, 1], [0, 0, 0, 0, 1])];
        const inputStabilizer = oneStabilizer.concat(unknownOne, bellStabilizer, unknownTwo);
        const computedState = stateFromStabilizer(inputStabilizer);
        expect(computedState).toEqual([KetOne, UnknownKetState, KetBellPlus, UnknownKetState]);
    });
})
