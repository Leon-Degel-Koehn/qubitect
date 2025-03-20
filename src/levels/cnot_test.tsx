import { Level, Circuit, Stabilizer, Hadamard, ControlledPauliX } from "../types.js";

export const EPR: Level = {
  availableGates: [
    new ControlledPauliX(-1, -1),
    new Hadamard(-1),
  ],
  inputState: [
    new Stabilizer(1, [0, 0], [1, 0]),
    new Stabilizer(1, [0, 0], [0, 1]),
  ],
  expectedResult: [
    new Stabilizer(1, [1, 1], [0, 0]),
    new Stabilizer(1, [0, 0], [1, 1]),
  ],
  circuit: new Circuit(2, [
    new Hadamard(0),
    new ControlledPauliX(0, 1),
  ]),
  greyedOutIndices: [0, 1],
  title: "The EPR pair",
  objective: "Entangle the two states to obtain a bell state!",
};
