import {
    Circuit,
    ControlledPauliX,
    Hadamard,
    Level,
    Measurement,
    PauliX,
    PauliZ,
    Stabilizer,
} from "../types.js";

export const SuperdenseCoding: Level = {
    availableGates: [new PauliX(-1), new PauliZ(-1)],
    inputState: [
        new Stabilizer(1, [1, 1], [0, 0]),
        new Stabilizer(1, [0, 0], [1, 1]),
    ],
    expectedResult: [
        new Stabilizer(-1, [0, 0], [1, 0]),
        new Stabilizer(-1, [0, 0], [0, 1]),
    ],
    circuit: new Circuit(2, [
        // Alice encodes the bits 11
        new PauliX(0),
        new PauliZ(0),
        // new Measurement(new Stabilizer(1, [1, 1], [0, 0])),
        // new Measurement(new Stabilizer(1, [0, 0], [1, 1])),
        // Bell measurement circuit with standard base measurement instead of direct bell measurements
        new ControlledPauliX(0, 1),
        new Hadamard(0),
        new Measurement(new Stabilizer(1, [0, 0], [1, 0])),
        new Measurement(new Stabilizer(1, [0, 0], [0, 1])),
    ]),
    greyedOutIndices: [0, 1],
    title: "Superdense coding protocol 🧪",
};
