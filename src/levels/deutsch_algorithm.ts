import {
    Level,
    Circuit,
    Stabilizer,
    PauliX,
    Hadamard,
    PauliZ,
    DeutschOracleFunction,
    Measurement,
} from "../types.js";

export const DeutschAlgorithmBalanced: Level = {
    availableGates: [new PauliX(-1), new PauliZ(-1), new Hadamard(-1)],
    inputState: [
        new Stabilizer(1, [0, 0], [1, 0]),
        new Stabilizer(1, [0, 0], [0, 1]),
    ],
    expectedResult: [
        new Stabilizer(1, [0, 0], [1, 0]),
        new Stabilizer(-1, [0, 1], [0, 0]),
    ],
    circuit: new Circuit(2, [
        new PauliX(1),
        new Hadamard(0),
        new Hadamard(1),
        new DeutschOracleFunction(0, 1, true),
        new Hadamard(0),
        new Measurement(new Stabilizer(1, [0, 0], [1, 0])),
    ]),
    greyedOutIndices: [0],
    title: "Deutsch's algorithm: balanced Oracle function ⚖️",
};

export const DeutschAlgorithmUnbalanced: Level = {
    availableGates: [new PauliX(-1), new PauliZ(-1), new Hadamard(-1)],
    inputState: [
        new Stabilizer(1, [0, 0], [1, 0]),
        new Stabilizer(1, [0, 0], [0, 1]),
    ],
    expectedResult: [
        new Stabilizer(-1, [0, 0], [1, 0]),
        new Stabilizer(-1, [0, 1], [0, 0]),
    ],
    circuit: new Circuit(2, [
        new PauliX(1),
        new Hadamard(0),
        new Hadamard(1),
        new DeutschOracleFunction(0, 1, false),
        new Hadamard(0),
        new Measurement(new Stabilizer(1, [0, 0], [1, 0])),
    ]),
    greyedOutIndices: [0],
    title: "Deutsch's algorithm: balanced Oracle function ⚖️",
};
