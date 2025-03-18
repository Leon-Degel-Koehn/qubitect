import { Level, Circuit, Stabilizer, PauliX, Hadamard, PauliZ } from "../types.js";

export const TestLevel: Level = {
  availableGates: [
    new PauliX(-1),
    new PauliZ(-1),
  ],
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
};
