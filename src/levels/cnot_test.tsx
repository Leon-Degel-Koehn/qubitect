import {
    Level,
    Circuit,
    Stabilizer,
    Hadamard,
    ControlledPauliX,
    PauliZ,
    PauliX,
} from "../types.js";

export const EPR: Level = {
    availableGates: [
        new ControlledPauliX(-1, -1),
        new Hadamard(-1),
        new PauliZ(-1),
        new PauliX(-1),
    ],
    inputState: [
        new Stabilizer(1, [0, 0], [1, 0]),
        new Stabilizer(1, [0, 0], [0, 1]),
    ],
    expectedResult: [
        new Stabilizer(1, [1, 1], [0, 0]),
        new Stabilizer(1, [0, 0], [1, 1]),
    ],
    circuit: new Circuit(2, [new Hadamard(0), new ControlledPauliX(0, 1)]),
    greyedOutIndices: [0, 1],
    title: "The EPR pair",
    objective: "Entangle the two states to obtain a bell state!",
    help: `The EPR Paradox and the Bell State

In this level, you need to create a Bell+ state, one of the four Bell states, which are maximally entangled quantum states. This state is an example of an EPR pair, named after a famous 1935 paper by Einstein, Podolsky, and Rosen (EPR).
Einstein’s “Spooky Action at a Distance”

Einstein and his colleagues argued that quantum mechanics must be incomplete because of the strange behavior of entangled particles. If two particles are entangled, measuring one instantly determines the state of the other—even if they are light-years apart. Einstein called this “spooky action at a distance” and believed it violated relativity, which states that no information can travel faster than light.
Bell’s Theorem and Quantum Reality

Decades later, physicist John Bell formulated Bell’s theorem, which showed that if quantum mechanics were wrong, certain measurable inequalities should hold. However, experiments confirmed that quantum mechanics is correct, and entanglement is real—without any hidden variables at play.

Today, entangled states like the Bell+ state are crucial for quantum teleportation, quantum cryptography, and superdense coding. By creating this state, you’re stepping into the same debate that challenged Einstein and shaped the foundations of quantum mechanics!`,
};
