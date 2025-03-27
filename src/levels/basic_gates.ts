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

export const BasicGates: Level = {
    availableGates: [new PauliX(-1), new PauliZ(-1), new Hadamard(-1)],
    inputState: [
        new Stabilizer(1, [0, 0, 0], [1, 0, 0]),
        new Stabilizer(1, [0, 1, 0], [0, 0, 0]),
        new Stabilizer(1, [0, 0, 0], [0, 0, 1]),
    ],
    expectedResult: [
        new Stabilizer(-1, [0, 0, 0], [1, 0, 0]),
        new Stabilizer(-1, [0, 1, 0], [0, 0, 0]),
        new Stabilizer(1, [0, 0, 1], [0, 0, 0]),
    ],
    circuit: new Circuit(3, [new PauliX(0), new PauliZ(1), new Hadamard(2)]),
    greyedOutIndices: [0, 1, 2],
    title: "Explore basic gate functionality 🔬",
    objective: `Try out the different gates and see what they do to the input state.
    Can you find the correct sequence of gates to get the expected output? 🤔`,
    help: `Check the functionality of each gate by clicking on your selected gate for a second time 🔎.`,
};
