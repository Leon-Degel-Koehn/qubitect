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
    objective: `Turn the resulting state of the third qubit into the input state of the first qubit! 🚀`,
    help: `Quantum Teleportation – Move Qubits Without Moving Them

In this level, you’ll explore quantum teleportation, a protocol that allows you to transfer a qubit’s state from one place to another without physically moving the qubit itself!
How Does It Work?

The secret ingredient is entanglement. Alice and Bob share an EPR pair (a Bell state). Alice then interacts her qubit with the one she wants to teleport and performs a Bell measurement. This collapses the system and gives her two classical bits of information, which she sends to Bob. Using these bits, Bob applies the right quantum gate to his qubit, perfectly reconstructing the original state!
Why Is This So Cool?

Unlike science fiction teleportation, no physical particle is transferred—only the state moves! However, because classical bits must be sent, no information travels faster than light, preserving relativity.

Quantum teleportation is key to quantum networks, cryptography, and even future quantum internet. Can you teleport like a quantum pro? 🚀✨`,
    successText: "🚀 You just teleported to success! 🚀",
};
