import {
    Level,
    Circuit,
    Stabilizer,
    PauliX,
    Hadamard,
    PauliZ,
    Measurement,
    ControlledPauliX,
    ControlledPauliZ,
} from "../types.js";

export const Teleportation: Level = {
    availableGates: [
        new PauliX(-1),
        new PauliZ(-1),
        new Hadamard(-1),
        new ControlledPauliX(-1, -1),
    ],
    inputState: [
        new Stabilizer(-1, [1, 0, 0], [0, 0, 0]),
        new Stabilizer(1, [0, 1, 1], [0, 0, 0]),
        new Stabilizer(1, [0, 0, 0], [0, 1, 1]),
    ],
    expectedResult: [
        new Stabilizer(-1, [0, 0, 1], [0, 0, 0]),
        new Stabilizer(1, [0, 0, 0], [0, 0, 0]), // don't care output of measurement
        new Stabilizer(1, [0, 0, 0], [0, 0, 0]), // don't care output of measurement
    ],
    circuit: new Circuit(3, [
        new ControlledPauliX(0, 1),
        new Hadamard(0),
        new Measurement(new Stabilizer(1, [0, 0, 0], [1, 0, 0])),
        new Measurement(new Stabilizer(1, [0, 0, 0], [0, 1, 0])),
        new ControlledPauliX(1, 2),
        new ControlledPauliZ(0, 2),
    ]),
    greyedOutIndices: [0, 1],
    title: "Quantum teleportation protocol",
};
