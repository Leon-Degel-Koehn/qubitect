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
    objective: `Alice wants to send Bob the two bits 11 of information by sending only one qubit. Can you help her? 📩 
        Find the correct gate sequence to encode the bits 11 on Alice's qubit. Bob gets the information by measuring both qubits. 🕵🏻‍♂️`,
    help: `Superdense Coding – Sending More with Less

In this level, you’ll explore superdense coding, a quantum communication protocol that allows you to send two classical bits of information using only one qubit—a trick that’s impossible in classical physics!
How Does It Work?

The key to this protocol is entanglement. Before communication starts, two players (Alice and Bob) share a Bell state. Alice then applies specific quantum gates to her qubit based on the two classical bits she wants to send. When Bob receives the qubit, he performs a Bell measurement to extract both bits of information.
Why Is This Mind-Blowing 🤯?

Classically, one bit of information can only carry one bit of data. But thanks to quantum entanglement, Alice can manipulate her shared qubit in a way that encodes two bits before sending it to Bob. This has huge implications for quantum networking and secure communication!

Can you master this quantum hack and send double the information with half the resources? 🚀`,
};
