import { Stabilizer, KetState, KetZero, Circuit, Gate, KetOne, KetPlus, KetMinus, KNOWN_STATES } from "./types.js";
import * as math from 'mathjs';

const isInStabilizerSet = (generator: Stabilizer, stabilizerSet: Stabilizer[]): boolean => {
    let basisMatrix = stabilizerSet.map(stabilizer => stabilizer.x_part.concat(stabilizer.z_part));
    const A = math.transpose(math.matrix(basisMatrix));
    const A_pinv = math.pinv(A);
    const generatorVector = generator.x_part.concat(generator.z_part);
    const b = math.matrix(generatorVector);
    const solution = math.multiply(A_pinv, b).toArray().map(x => Number(x));
    if (math.norm(math.subtract(b, math.multiply(A, solution))) == 0) {
        const absSolution = solution.map(x => Math.abs(x));
        let phase = 1;
        for (let i = 0; i < absSolution.length; i++) {
            phase *= Math.pow(stabilizerSet[i].phase, absSolution[i]);
        }
        return phase == generator.phase;
    } else {
        return false;
    }
}

const cartesianPower = (array: KetState[], n: number): KetState[][] => {
    if (n <= 0) return [[]]; // Base case: Cartesian product of zero arrays is [[]]

    return Array.from({ length: n }).reduce<KetState[][]>(
        acc => acc.flatMap(d => array.map(e => [...d, e])),
        [[]] // Start with an array containing an empty array
    );
};

export const stateFromStabilizer = (stabilizer: Stabilizer[]): KetState[] => {
    const num_qubits = stabilizer[0].x_part.length;
    for (let stateCombo of cartesianPower(KNOWN_STATES, num_qubits)) {
        let currStabilizer: Stabilizer[] = []
        for (let i = 0; i < stateCombo.length; i++) {
            let substate = stateCombo[i];
            let targetQubits: number[] = [];
            for (let targetQubit = i; targetQubit - i < substate.stabilizer[0].x_part.length; targetQubit++) {
                targetQubits.push(targetQubit);
            }
            currStabilizer = currStabilizer.concat(substate.stabilizer.map((generator) => generator.onQubits(targetQubits, num_qubits)));
        }
        let contains = true;
        for (let generator of currStabilizer) {
            if (!isInStabilizerSet(generator, stabilizer)) {
                contains = false;
            }
        }
        if (contains) {
            return stateCombo;
        }
    }
    // unknown state, dummy return
    return Array(num_qubits).fill(KetOne);
}
