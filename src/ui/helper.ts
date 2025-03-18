import { Session } from "../levels/types.js";
import { Level, Gate, Identity, PlaceholderGate } from "../types.js";

type GateLayoutEntry = {
    originalIdx: number,
    gate: Gate,
}

type GateLayout = GateLayoutEntry[][];

export const gateLayout = (session: Session): GateLayout => {
    let gateMat = new Array();
    gateMat = addColumn(gateMat, session.displayedCircuit.qubits);
    for (let i = 0; i < session.displayedCircuit.gates.length; i++) {
        let currGate = session.displayedCircuit.gates[i];
        let lastCol = gateMat[gateMat.length - 1];
        for (let targetQubit of currGate.affectedQubits) {
            if (!(lastCol[targetQubit].gate instanceof Identity)) {
                gateMat = addColumn(gateMat, session.displayedCircuit.qubits);
            }
        }
        lastCol = gateMat[gateMat.length - 1];
        let gateToInsert = session.displayedCircuit.gates[i];
        for (let targetQubit of gateToInsert.affectedQubits) {
            lastCol[targetQubit].gate = gateToInsert;
            lastCol[targetQubit].originalIdx = i;
        }
    }
    return gateMat;
}

const addColumn = (gateMat: GateLayout, qubits: number) => {
    gateMat.push(new Array());
    const lastIdx = gateMat.length - 1;
    for (let i = 0; i < qubits; i++) {
        gateMat[lastIdx].push({ originalIdx: -1, gate: new Identity(i) });
    }
    return gateMat;
}
