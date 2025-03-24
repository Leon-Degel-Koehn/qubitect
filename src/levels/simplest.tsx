import {
    Level,
    Circuit,
    Stabilizer,
    PauliX,
    Hadamard,
    PauliZ,
} from "../types.js";

export const TestLevel: Level = {
    availableGates: [new PauliX(-1), new PauliZ(-1)],
    inputState: [
        new Stabilizer(1, [0, 0], [1, 0]),
        new Stabilizer(1, [0, 0], [0, 1]),
    ],
    expectedResult: [
        new Stabilizer(-1, [0, 0], [1, 0]),
        new Stabilizer(-1, [0, 0], [0, 1]),
    ],
    circuit: new Circuit(2, [
        new PauliX(0),
        new Hadamard(1),
        new PauliZ(1),
        new Hadamard(1),
    ]),
    greyedOutIndices: [2],
    title: "The X is the Z in the X-Basis 🤯",
    objective: "Create the output state |1>, |1>",
};

export const Level1: Level = TestLevel;
export const Level2: Level = {
    availableGates: [new PauliX(-1), new PauliZ(-1)],
    inputState: [
        new Stabilizer(1, [0, 0], [1, 0]),
        new Stabilizer(1, [0, 0], [0, 1]),
    ],
    expectedResult: [
        new Stabilizer(-1, [0, 0], [1, 0]),
        new Stabilizer(-1, [0, 0], [0, 1]),
    ],
    circuit: new Circuit(2, [
        new PauliX(0),
        new Hadamard(1),
        new PauliZ(1),
        new Hadamard(1),
    ]),
    greyedOutIndices: [2],
    title: "Test 2",
    objective: "Create the output state |0>, |1>",
};
