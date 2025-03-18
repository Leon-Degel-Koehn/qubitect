import { useState } from "@devvit/public-api";
import { Circuit, Gate, Level, PlaceholderGate } from "../types.js";

export class Session {
    level: Level;
    displayedCircuit: Circuit;

    constructor(level: Level) {
        this.level = level;
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

    changeDisplayedGate(greyedOutIdx: number, newGateIdx: number) {
        let gateIdx = this.level.greyedOutIndices[greyedOutIdx];
        let gate;
        if (newGateIdx >= 0) {
            gate = this.level.availableGates[newGateIdx];
            gate.affectedQubits = this.level.circuit.gates[gateIdx].affectedQubits;
        } else {
            gate = new PlaceholderGate(this.level.circuit.gates[gateIdx].affectedQubits)
        }
        this.displayedCircuit.gates[gateIdx] = gate;
    }
}
