import { useState } from "@devvit/public-api";
import { Circuit, Gate, KNOWN_STATES, Level, PlaceholderGate } from "../types.js";
import { stateFromStabilizer } from "../utils.js";

export class Session {
    level: Level;
    displayedCircuit: Circuit;
    optimalOutput: number[]; // indices of the ket states corresponding to the optimal output

    constructor(level: Level) {
        this.level = level;
        this.optimalOutput = stateFromStabilizer(level.expectedResult).map((ket) => KNOWN_STATES.indexOf(ket));
        this.displayedCircuit = new Circuit(
            level.circuit.qubits,
            [],
        )
        for (let i = 0; i < level.circuit.gates.length; i++) {
            if (level.greyedOutIndices.includes(i)) {
                this.displayedCircuit.gates.push(
                    new PlaceholderGate(level.circuit.gates[i].affectedQubits)
                )
            } else {
                this.displayedCircuit.gates.push(
                    // ok to just use here as it will never be changed
                    level.circuit.gates[i]
                )
            }
        }
    }

    changeDisplayedGate(locationIdx: number, newGateIdx: number, updateOutput: Function) {
        let gate;
        if (newGateIdx >= 0) {
            gate = this.level.availableGates[newGateIdx];
            gate.affectedQubits = this.level.circuit.gates[locationIdx].affectedQubits;
        } else {
            gate = new PlaceholderGate(this.level.circuit.gates[locationIdx].affectedQubits)
        }
        this.displayedCircuit.gates[locationIdx] = gate;
        const output = this.displayedCircuit.simulate(this.level.inputState);
        const ketOutput = stateFromStabilizer(output);
        updateOutput(ketOutput.map((ketState) => KNOWN_STATES.indexOf(ketState)));
    }
}
