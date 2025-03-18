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

    //newGate is the index of the gate to display
    changeDisplayedGate(idx: number, newGate: number) {
        console.log("test");
        if (!this.level.greyedOutIndices.includes(idx))
            return;
        // just to make sure no errors happen, if weird gates are passed
        let gate = this.level.availableGates[newGate];
        gate.affectedQubits = this.level.circuit.gates[idx].affectedQubits;
        this.displayedCircuit.gates[idx] = gate;
    }
}
