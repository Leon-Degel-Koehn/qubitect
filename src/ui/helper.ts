import { Level, Gate, Identity, PlaceholderGate } from "../types.js";

export const gateLayout = (level: Level): Gate[][] => {
    let gateMat = new Array();
    gateMat = addColumn(gateMat, level.circuit.qubits);
    for (let i = 0; i < level.circuit.gates.length; i++) {
        let currGate = level.circuit.gates[i];
        let lastCol = gateMat[gateMat.length - 1];
        for (let targetQubit of currGate.affectedQubits) {
            if (!(lastCol[targetQubit] instanceof Identity)) {
                gateMat = addColumn(gateMat, level.circuit.qubits);
            }
        }
        lastCol = gateMat[gateMat.length - 1];
        let gateToInsert = gateOrPlaceholder(level.greyedOutIndices, level.circuit.gates, i);
        for (let targetQubit of gateToInsert.affectedQubits) {
            lastCol[targetQubit] = gateToInsert;
        }
    }
    return gateMat;
}

const addColumn = (gateMat: Gate[][], qubits: number) => {
    gateMat.push(new Array());
    const lastIdx = gateMat.length - 1;
    for (let i = 0; i < qubits; i++) {
        gateMat[lastIdx].push(new Identity(i));
    }
    return gateMat;
}

const gateOrPlaceholder = (greyedOuts: number[], gates: Gate[], idx: number): Gate => {
    if (greyedOuts.includes(idx)) {
        return new PlaceholderGate(gates[idx].affectedQubits)
    }
    return gates[idx];
}
