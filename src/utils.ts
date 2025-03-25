import {
    Stabilizer,
    KetState,
    KetZero,
    Circuit,
    Gate,
    KetOne,
    KetPlus,
    KetMinus,
    KNOWN_STATES,
    UnknownKetState,
} from "./types.js";
import * as math from "mathjs";

const isInStabilizerSet = (
    generator: Stabilizer,
    stabilizerSet: Stabilizer[],
): boolean => {
    const basisMatrix = stabilizerSet.map((stabilizer) =>
        stabilizer.x_part.concat(stabilizer.z_part),
    );
    const A = math.transpose(math.matrix(basisMatrix));
    const A_pinv = math.pinv(A);
    const generatorVector = generator.x_part.concat(generator.z_part);
    const b = math.matrix(generatorVector);
    const solution = math
        .multiply(A_pinv, b)
        .toArray()
        .map((x) => Number(x));
    if (math.norm(math.subtract(b, math.multiply(A, solution))) == 0) {
        const absSolution = solution.map((x) => Math.abs(x));
        let phase = 1;
        for (let i = 0; i < absSolution.length; i++) {
            phase *= Math.pow(stabilizerSet[i].phase, absSolution[i]);
        }
        return phase == generator.phase;
    } else {
        return false;
    }
};

const cartesianPower = (array: KetState[], n: number): KetState[][] => {
    if (n <= 0) return [[]]; // Base case: Cartesian product of zero arrays is [[]]

    return Array.from({ length: n }).reduce<KetState[][]>(
        (acc) => acc.flatMap((d) => array.map((e) => [...d, e])),
        [[]], // Start with an array containing an empty array
    );
};

function getSubsets<T>(arr: T[]): T[][] {
    const result: T[][] = [];
    const n = arr.length;

    // There are 2^n subsets
    const totalSubsets = 1 << n;

    // start at -2 because we dont need the full set as one of the subsets
    for (let i = totalSubsets - 2; i > 0; i--) {
        const subset: T[] = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) {
                subset.push(arr[j]);
            }
        }
        result.push(subset);
    }

    return result;
}

const range = (len: number): number[] => {
    const res = Array(len);
    for (let i = 0; i < len; i++) {
        res[i] = i;
    }
    return res;
};

export const stateFromStabilizer = (
    stabilizer: Stabilizer[],
    bestEffort = true,
): KetState[] => {
    const numQubits = stabilizer[0].x_part.length;
    for (let comboLen = 1; comboLen < 2 * numQubits; comboLen++) {
        // just a heuristic on the upper loop bound
        for (const stateCombo of cartesianPower(KNOWN_STATES, comboLen)) {
            const affectedQubits = stateCombo
                .map((s) => s.stabilizer[0])
                .reduce((acc, curr) => acc + curr.x_part.length, 0);
            if (affectedQubits > numQubits) continue;
            let currStabilizer: Stabilizer[] = [];
            for (let i = 0, currQubit = 0; i < stateCombo.length; i++) {
                const substate = stateCombo[i];
                const targetQubits: number[] = [];
                for (
                    let targetQubit = currQubit;
                    targetQubit - currQubit <
                    substate.stabilizer[0].x_part.length;
                    targetQubit++
                ) {
                    targetQubits.push(targetQubit);
                }
                currQubit += targetQubits.length;
                currStabilizer = currStabilizer.concat(
                    substate.stabilizer.map((generator) =>
                        generator.onQubits(targetQubits, numQubits),
                    ),
                );
            }
            let contains = true;
            for (const generator of currStabilizer) {
                if (!isInStabilizerSet(generator, stabilizer)) {
                    contains = false;
                }
            }
            contains =
                contains &&
                stabilizer.every((s) => isInStabilizerSet(s, currStabilizer));
            if (contains) {
                return stateCombo;
            }
        }
    }

    if (bestEffort) {
        // Fallback: from here on we know that that stabilized state is not fully known.
        // To enhance the user experience however, we try to identify as many substates of the
        // stabilized state as possible, to minimize the number of "?" displayed in the output.
        const qubitSet = range(numQubits);
        const qubitSubsets = getSubsets(qubitSet);
        qubitSubsets.sort((a, b) => b.length - a.length);
        for (const subset of qubitSubsets) {
            const subsetStabilizer = stabilizer
                .map(
                    (s) =>
                        new Stabilizer(
                            s.phase,
                            s.x_part.filter((_, idx) => subset.includes(idx)),
                            s.z_part.filter((_, idx) => subset.includes(idx)),
                        ),
                )
                .filter(
                    (s) =>
                        !s.x_part.every((e) => e == 0) ||
                        !s.z_part.every((e) => e == 0),
                );
            const stabilizedState = stateFromStabilizer(
                subsetStabilizer,
                false,
            );
            if (!stabilizedState.every((state) => state == UnknownKetState)) {
                const result: KetState[] = [];
                for (let i = 0; i < numQubits; ) {
                    if (subset.includes(i)) {
                        const stabilizedQubits =
                            stabilizedState[0].stabilizer[0].x_part.length;
                        result.push(stabilizedState.shift() || UnknownKetState);
                        i += stabilizedQubits;
                    } else {
                        result.push(UnknownKetState);
                        i++;
                    }
                }
                return result;
            }
        }
    }
    return Array(numQubits).fill(UnknownKetState);
};
