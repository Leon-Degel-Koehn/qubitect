import { Circuit, KNOWN_STATES, Level, PlaceholderGate } from "../types.js";
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
        // TODO: replace by map call in the constructor
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

    updateOutput(updateCallback: Function) {
        const output = this.displayedCircuit.simulate(this.level.inputState);
        const ketOutput = stateFromStabilizer(output);
        updateCallback(ketOutput.map((ketState) => KNOWN_STATES.indexOf(ketState)));
        console.log("output states updated");
    }

    changeDisplayedGate(locationIdx: number, newGateIdx: number) {
        if (!this.level.greyedOutIndices.includes(locationIdx)) return;
        let gate;
        if (newGateIdx >= 0) {
            gate = this.level.availableGates[newGateIdx];
            const gateSize = gate.affectedQubits.length;
            gate.affectedQubits = this.level.circuit.gates[locationIdx].affectedQubits.slice(0, gateSize);
            let max = Math.max(...gate.affectedQubits);
            while (gateSize > gate.affectedQubits.length) {
                gate.affectedQubits.push(++max);
            }
        } else {
            gate = new PlaceholderGate(this.level.circuit.gates[locationIdx].affectedQubits)
        }
        gate.actionTable.affectedQubits = gate.affectedQubits;
        this.displayedCircuit.gates[locationIdx] = gate;
        console.log("displayed gates updated");
    }
}
