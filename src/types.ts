import * as numeric from 'numeric';
// dummy asset in place where an identity operation is performed
const ID_ASSET = "";

export interface Level {
    // TODO: expand
    levelId?: number,
    circuit: Circuit,
    availableGates: Gate[],
}

export class Circuit {
    qubits: number;

    // NOTE: these need to necessarily be in the correct order!
    gates: Gate[];

    constructor(qubits: number, gates: Gate[]) {
        this.qubits = qubits;
        this.gates = gates;
    }

    simulate(input: Stabilizer[]): Stabilizer[] {
        // Iterate over all gates and change stabilizer accordingly
        for (const gate of this.gates) {
            input = gate.simulate(input);
        }
        return input;
    }
}

export class Stabilizer {
    phase: number;
    x_part: number[];
    z_part: number[];

    constructor(phase: number, x_par: number[], z_par: number[]) {
        this.phase = phase;
        this.x_part = x_par;
        this.z_part = z_par;
    }

    add(rhs: Stabilizer): Stabilizer {
        const phase = this.phase * rhs.phase;
        const x_part = this.x_part.map((x, i) => x ^ rhs.x_part[i]);
        const z_part = this.z_part.map((z, i) => z ^ rhs.z_part[i]);
        return new Stabilizer(phase, x_part, z_part);
    }

    commutes_with(rhs: Stabilizer): boolean {
        return (this.inner_product(this.x_part, rhs.z_part) ^ this.inner_product(this.z_part, rhs.x_part)) == 0;
    }

    inner_product(lhs: number[], rhs: number[]): number {
        return lhs.reduce((acc, x, i) => acc ^ x & rhs[i], 0);
    }

    to_string() {
        // TODO
    }
}

function copyStabilizer(original: Stabilizer): Stabilizer {
    return Object.assign({}, original); // looks weird but is essentially .copy() in python
}

/*
 * Gates act on a specific subset of qubits.
 * The order of specification on which qubits they act is important.
 * A CNOT with control on qubit 3 and target qubit 2 should have affectedQubits = [3,2]
 * The assets need to be defined analogously, the control dot asset must be specified first.
 */
export interface Gate {
    affectedQubits: number[],
    assets: string[],

    // Specifying pairs of connected qubits leads there to be a line connecting the two in the UI
    // This is necessary for example to create a CNOT.
    connectedQubits?: [number, number][],

    // Function that maps from stabilizers to stabilizers, with an optional measurement result
    // if the gate is to define a measurement.
    simulate(input: Stabilizer[]): Stabilizer[];
}

export class Identity implements Gate {
    affectedQubits: number[];
    assets: string[];

    constructor(targetQubit: number) {
        this.affectedQubits = [targetQubit];
        this.assets = [ID_ASSET];
    }

    simulate(input: Stabilizer[]): Stabilizer[] {
        return input;
    }
}

export class Hadamard implements Gate {
    affectedQubits: number[];
    assets: string[];

    constructor(targetQubit: number) {
        this.affectedQubits = [targetQubit];
        this.assets = ["hadamard.png"];
    }

    simulate(input: Stabilizer[]): Stabilizer[] {
        // Swap the X and Z parts of the stabilizer
        const result = [];
        for (const stabilizer of input) {
            const x_part = stabilizer.x_part;
            const z_part = stabilizer.z_part;
            for (const affectedQubit of this.affectedQubits) {
                // Swap the X and Z parts of the stabilizer
                // FIXME: Old stabilizer is not preserved
                const temp = x_part[affectedQubit];
                x_part[affectedQubit] = z_part[affectedQubit];
                z_part[affectedQubit] = temp;
            }
            result.push(new Stabilizer(stabilizer.phase, x_part, z_part));
        }
        return result;
    }
}

export class PauliX implements Gate {
    affectedQubits: number[];
    assets: string[];

    constructor(targetQubit: number) {
        this.affectedQubits = [targetQubit];
        this.assets = ["pauli_x.png"];
    }

    simulate(input: Stabilizer[]): Stabilizer[] {
        // Flip phase of Z part
        const result = [];
        for (const stabilizer of input) {
            const x_part = stabilizer.x_part;
            const z_part = stabilizer.z_part;
            let phase = stabilizer.phase;
            for (const affectedQubit of this.affectedQubits) {
                phase *= -z_part[affectedQubit];
            }
            result.push(new Stabilizer(phase, x_part, z_part));
        }
        return result;
    }
}

export class PauliZ implements Gate {
    affectedQubits: number[];
    assets: string[];

    constructor(targetQubit: number) {
        this.affectedQubits = [targetQubit];
        this.assets = ["pauli_z.png"];
    }

    simulate(input: Stabilizer[]): Stabilizer[] {
        // Flip phase of X part
        const result = [];
        for (const stabilizer of input) {
            const x_part = stabilizer.x_part;
            const z_part = stabilizer.z_part;
            let phase = stabilizer.phase;
            for (const affectedQubit of this.affectedQubits) {
                phase *= -x_part[affectedQubit];
            }
            result.push(new Stabilizer(phase, x_part, z_part));
        }
        return result;
    }
}

export class PauliY implements Gate {
    affectedQubits: number[];
    assets: string[];

    constructor(targetQubit: number) {
        this.affectedQubits = [targetQubit];
        this.assets = ["pauli_y.png"];
    }

    simulate(input: Stabilizer[]): Stabilizer[] {
        // Flip phase of Z and X part
        const result = [];
        for (const stabilizer of input) {
            const x_part = stabilizer.x_part;
            const z_part = stabilizer.z_part;
            let phase = stabilizer.phase;
            for (const affectedQubit of this.affectedQubits) {
                phase *= Math.pow(-1, z_part[affectedQubit] + x_part[affectedQubit]);
            }
            result.push(new Stabilizer(phase, x_part, z_part));
        }
        return result;
    }
}

export class Measurement implements Gate {
    affectedQubits: number[];
    assets: string[];
    measurementOperator: Stabilizer;

    constructor(measurementOperator: Stabilizer) {
        // Affected qubits can be derived from the stabilizer
        this.affectedQubits = [];
        this.assets = ["standard_measure.png"];
        this.measurementOperator = measurementOperator;
    }

    simulate(input: Stabilizer[]): Stabilizer[] {
        // Check if measurement operator commutes with all stabilizer generators
        let commutes = true;
        for (const stabilizer of input) {
            commutes = commutes && this.measurementOperator.commutes_with(stabilizer);
        }
        // If it commutes, the measurement is deterministic
        if (commutes) {
            // Check if the measurement operator is a stabilizer => outcome = 0
            // This is done by checking if the measurement operator is in subspace spanned by the stabilizer generators
            let basisMatrix = input.map(stabilizer => stabilizer.x_part.concat(stabilizer.z_part));
            basisMatrix = numeric.transpose(basisMatrix);
            const measurementOperatorVector = this.measurementOperator.x_part.concat(this.measurementOperator.z_part);
            // FIXME: numeric.solve is not working as expected
            const solution = numeric.solve(basisMatrix, measurementOperatorVector);
            if (solution) {
                // Measurement operator is in the stabilizer subspace => Post-measurement stabilizer is not changed
                // However, we need to find out the measurement result by checking the phase
                // 1. Take absolute value of solution vector
                const absSolution = solution.map(x => Math.abs(x));
                // 2. Find resulting phase
                let phase = 1;
                for (let i = 0; i < absSolution.length; i++) {
                    phase *= absSolution[i] * input[i].phase;
                }
                console.log("Measurement result: ", phase >= 0 ? 0 : 1);
                return input;
            } else {
                throw new Error("Error calculating measurement result");
            }
        } else {
            // 1. Flip coin to determine measurement result
            const result = Math.random() < 0.5 ? 0 : 1;
            console.log("Measurement result: ", result);
            // 2. Find generator that anti-commutes with measurement operator
            const postMeasurementStabilizers = [];
            const antiCommutesIndex = input.findIndex(stabilizer => !this.measurementOperator.commutes_with(stabilizer));
            // 3. Replace all other anti-commuting generators with product of measurement operator and anti-commuting generator
            for (let i = 0; i < input.length; i++) {
                if (i != antiCommutesIndex) {
                    postMeasurementStabilizers.push(input[i].add(input[antiCommutesIndex]));
                }
            }
            // 4. Flip phase of anti-commuting generator if result is 1
            const antiCommutes = input[antiCommutesIndex];
            if (result == 1) {
                antiCommutes.phase *= -1;
            }
            postMeasurementStabilizers.push(antiCommutes);
            return postMeasurementStabilizers;
        }
    }
}
