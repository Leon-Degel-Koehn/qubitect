import { Session } from "../levels/types.js";
import { Gate, Identity } from "../types.js";

type GateLayoutEntry = {
    originalIdx: number;
    gate: Gate;
    idxInAffectedQubits: number;
};

export type GateLayout = GateLayoutEntry[][];

export const gateLayout = (session: Session): GateLayout => {
    let gateMat = [];
    gateMat = addColumn(gateMat, session.displayedCircuit.qubits);
    for (let i = 0; i < session.displayedCircuit.gates.length; i++) {
        const currGate = session.displayedCircuit.gates[i];
        let lastCol = gateMat[gateMat.length - 1];
        for (const targetQubit of currGate.affectedQubits) {
            if (!(lastCol[targetQubit].gate instanceof Identity)) {
                gateMat = addColumn(gateMat, session.displayedCircuit.qubits);
            }
        }
        lastCol = gateMat[gateMat.length - 1];
        const gateToInsert = session.displayedCircuit.gates[i];
        gateToInsert.affectedQubits.forEach((targetQubit, idx) => {
            lastCol[targetQubit].gate = gateToInsert;
            lastCol[targetQubit].originalIdx = i;
            lastCol[targetQubit].idxInAffectedQubits = idx;
        });
    }
    return gateMat;
};

const addColumn = (gateMat: GateLayout, qubits: number) => {
    gateMat.push([]);
    const lastIdx = gateMat.length - 1;
    for (let i = 0; i < qubits; i++) {
        gateMat[lastIdx].push({
            originalIdx: -1,
            gate: new Identity(i),
            idxInAffectedQubits: 0,
        });
    }
    return gateMat;
};
