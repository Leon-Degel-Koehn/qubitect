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
    title: "Deutsch's algorithm: unbalanced Oracle function",
    objective: `Turn the measurement result of the first qubit into a 1, indicating that the Oracle function is unbalanced!`,
    help: `Deutsch’s Algorithm – Outsmarting Classical Limits

In this level, you’ll use Deutsch’s algorithm to determine a property of a hidden function faster than any classical method!
The Problem: A Hidden Function

You have access to a quantum oracle that implements an unknown function f(x). This function takes a single input bit (0 or 1) and returns either 0 or 1. The catch? You don’t need to know the exact outputs—just whether the function is constant (same for both inputs) or balanced (different for each input).
Quantum Speedup

Classically, you’d need to check f(0) and f(1) separately. Deutsch’s algorithm solves this in just one query by leveraging superposition and interference.
Why Is This Important?

This was one of the first quantum algorithms to show that quantum computers can outperform classical ones! It paved the way for more powerful quantum speedups, like Deutsch-Jozsa and Simon’s algorithms.

Can you harness interference to reveal the function’s nature in a single shot? 🚀✨`,
    successText: "🎯 Measured: 100% genius! 🧠",
};
