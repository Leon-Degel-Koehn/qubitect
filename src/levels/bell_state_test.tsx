import { Level, Circuit, Stabilizer, PauliX, Hadamard, PauliZ } from "../types.js";

export const BellStateTestLevel: Level = {
  availableGates: [
    new PauliX(-1),
    new PauliZ(-1),
    new Hadamard(-1),
  ],
  inputState: [
    new Stabilizer(1, [1, 1, 0], [0, 0, 0]),
    new Stabilizer(1, [0, 0, 0], [1, 1, 0]),
    new Stabilizer(1, [0, 0, 0], [0, 0, 1]),
  ],
  expectedResult: [
    new Stabilizer(1, [1, 1, 0], [0, 0, 0]),
    new Stabilizer(1, [0, 0, 0], [1, 1, 0]),
    new Stabilizer(1, [0, 0, 1], [0, 0, 0]),
  ],
  circuit: new Circuit(3, [
    new PauliX(0),
    new PauliX(1),
    new Hadamard(2),
  ]),
  greyedOutIndices: [1],
  title: "Test level for bell state display",
};
