import * as math from 'mathjs';
// dummy asset in place where an identity operation is performed
const ID_ASSET = "";

export interface Level {
    // TODO: expand
    circuit: Circuit,
    availableGates: Gate[],
    inputState: Stabilizer[],
    expectedResult: Stabilizer[],
    greyedOutIndices: number[],
    objective?: string, // A text to display to the user to clarify the task
    title?: string, // The headline title of the puzzle
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

    // assumes target qubits to be the right amount without checking
    onQubits(targetQubits: number[], totalQubits: number): Stabilizer {
        let x = Array(totalQubits).fill(0);
        let z = Array(totalQubits).fill(0);
        let i = 0;
        for (let idx of targetQubits) {
            x[idx] = this.x_part[i];
            z[idx] = this.z_part[i];
            i++;
        }
        return new Stabilizer(this.phase, x, z);
    }


    to_string() {
        // TODO
    }
}

export interface KetState {
    asset: string,
    stabilizer: Stabilizer[],
}

export const KetZero: KetState = {
    asset: "ket_0.png",
    stabilizer: [
        new Stabilizer(1, [0], [1]),
    ],
}

export const KetOne: KetState = {
    asset: "ket_1.png",
    stabilizer: [
        new Stabilizer(-1, [0], [1]),
    ],
}

export const KetPlus: KetState = {
    asset: "ket_plus.png",
    stabilizer: [
        new Stabilizer(1, [1], [0]),
    ],
}

export const KetMinus: KetState = {
    asset: "ket_minus.png",
    stabilizer: [
        new Stabilizer(-1, [1], [0]),
    ],
}

export const KetBellPlus: KetState = {
    asset: "ket_bell_plus.png",
    stabilizer: [
        new Stabilizer(1, [1, 1], [0, 0]),
        new Stabilizer(1, [0, 0], [1, 1]),
    ],
}

export const KNOWN_STATES = [KetZero, KetOne, KetMinus, KetPlus, KetBellPlus];

// FIXME: implement like above
export const UnknownKetState: KetState = {
    asset: "ket_unknown.png",
    stabilizer: [
        new Stabilizer(1, [0], [0]),
    ],
}

// FIXME: Doesn' t work with our new stabilizer def
function copyStabilizer(original: Stabilizer): Stabilizer {
    return Object.assign({}, original); // looks weird but is essentially .copy() in python
}

export class ActionTable {
    stabilizersWithAction: [Stabilizer, Stabilizer][]; // Pair of stabilizer and action
    affectedQubits: number[];

    constructor(stabilizersWithAction: [Stabilizer, Stabilizer][], affectedQubits: number[]) {
        this.stabilizersWithAction = stabilizersWithAction;
        this.affectedQubits = affectedQubits;
    }


    // Return iterator for all matching actions
    * findAllMatchingActions(stabilizer: Stabilizer): Iterable<Stabilizer> {
        // Check for all actions that have ones at the same indices as the stabilizer
        for (const [stabilizerToMatch, action] of this.stabilizersWithAction) {
            // Do this by performing a logical AND between the stabilizer and the stabilizer to match
            // Then check if the result is equal to the stabilizer to match
            let matches = true;
            for (let i = 0; i < this.affectedQubits.length; i++) {
                matches = matches && (stabilizer.x_part[this.affectedQubits[i]] & stabilizerToMatch.x_part[i]) == stabilizerToMatch.x_part[i];
            }
            for (let i = 0; i < this.affectedQubits.length; i++) {
                matches = matches && (stabilizer.z_part[this.affectedQubits[i]] & stabilizerToMatch.z_part[i]) == stabilizerToMatch.z_part[i];
            }
            if (matches) {
                yield action;
            }
        }
    }

    applyAction(stabilizer: Stabilizer, action: Stabilizer): Stabilizer {
        // Apply the action to the stabilizer
        let x_part = [...stabilizer.x_part];
        let z_part = [...stabilizer.z_part];
        for (let i = 0; i < this.affectedQubits.length; i++) {
            x_part[this.affectedQubits[i]] = action.x_part[i];
        }
        for (let i = 0; i < this.affectedQubits.length; i++) {
            z_part[this.affectedQubits[i]] = action.z_part[i];
        }
        return new Stabilizer(stabilizer.phase * action.phase, x_part, z_part);
    }
}

/*
 * Gates act on a specific subset of qubits.
 * The order of specification on which qubits they act is important.
 * A CNOT with control on qubit 3 and target qubit 2 should have affectedQubits = [3,2]
 * The assets need to be defined analogously, the control dot asset must be specified first.
 */
export class Gate {
    affectedQubits: number[];
    assets: string[];
    actionTable: ActionTable;


    // Default constructor to be used by child classes
    constructor(affectedQubits: number[], assets: string[], actionTable: ActionTable) {
        this.affectedQubits = affectedQubits;
        this.assets = assets;
        this.actionTable = actionTable;
    }

    // Function that maps from stabilizers to stabilizers, with an optional measurement result
    // if the gate is to define a measurement.
    simulate(input: Stabilizer[]): Stabilizer[] {
        // Iterate over all stabilizers and apply the action of the gate
        let result = []
        for (const stabilizer of input) {
            const actions = [...this.actionTable.findAllMatchingActions(stabilizer)];
            if (actions.length > 0) {
                let resultingStabilizer = new Stabilizer(1, Array(this.affectedQubits.length).fill(0), Array(this.affectedQubits.length).fill(0));
                for (const action of this.actionTable.findAllMatchingActions(stabilizer)) {
                    resultingStabilizer = resultingStabilizer.add(action);
                }
                result.push(this.actionTable.applyAction(stabilizer, resultingStabilizer));
            } else {
                result.push(stabilizer);
            }
        }
        return result;
    }
}

export class Identity extends Gate {
    constructor(targetQubit: number) {
        super([targetQubit], [ID_ASSET], new ActionTable([], []));
    }
}

export class PlaceholderGate extends Gate {
    constructor(affectedQubits: number[]) {
        super(affectedQubits, ["placeholder.png"], new ActionTable([], []));
    }
}

export class PauliX extends Gate {
    constructor(targetQubit: number) {
        let affectedQubits = [targetQubit];
        let assets = ["pauli_x.png"];
        let actionTable = new ActionTable([
            [new Stabilizer(1, [0], [1]), new Stabilizer(-1, [0], [1])]], affectedQubits);
        super(affectedQubits, assets, actionTable);
    }
}

export class PauliZ extends Gate {
    constructor(targetQubit: number) {
        let affectedQubits = [targetQubit];
        let assets = ["pauli_z.png"];
        let actionTable = new ActionTable([
            [new Stabilizer(1, [1], [0]), new Stabilizer(-1, [1], [0])]], affectedQubits);
        super(affectedQubits, assets, actionTable);
    }
}

export class PauliY extends Gate {
    constructor(targetQubit: number) {
        let affectedQubits = [targetQubit];
        let assets = ["pauli_y.png"];
        let actionTable = new ActionTable([
            [new Stabilizer(1, [0], [1]), new Stabilizer(-1, [0], [1])],
            [new Stabilizer(1, [1], [0]), new Stabilizer(-1, [1], [0])]], affectedQubits);
        super(affectedQubits, assets, actionTable);
    }
}

export class Hadamard extends Gate {
    constructor(targetQubit: number) {
        let affectedQubits = [targetQubit];
        let assets = ["hadamard.png"];
        let actionTable = new ActionTable([
            [new Stabilizer(1, [0], [1]), new Stabilizer(1, [1], [0])],
            [new Stabilizer(1, [1], [0]), new Stabilizer(1, [0], [1])]], affectedQubits);
        super(affectedQubits, assets, actionTable);
    }
}

export class ControlledPauliX extends Gate {
    constructor(controlQubit: number, targetQubit: number) {
        let affectedQubits = [controlQubit, targetQubit];
        let assets = ["cnot_0.png", "cnot_1.png"];
        let actionTable = new ActionTable([
            [new Stabilizer(1, [1, 0], [0, 0]), new Stabilizer(1, [1, 1], [0, 0])],
            [new Stabilizer(1, [0, 1], [0, 0]), new Stabilizer(1, [0, 1], [0, 0])],
            [new Stabilizer(1, [0, 0], [1, 0]), new Stabilizer(1, [0, 0], [1, 0])],
            [new Stabilizer(1, [0, 0], [0, 1]), new Stabilizer(1, [0, 0], [1, 1])]
        ], affectedQubits);
        super(affectedQubits, assets, actionTable);
    }
}

export class ControlledPauliZ extends Gate {
    constructor(controlQubit: number, targetQubit: number) {
        let affectedQubits = [controlQubit, targetQubit];
        let assets = ["cz_0.png", "cz_1.png"];
        let actionTable = new ActionTable([
            [new Stabilizer(1, [1, 0], [0, 0]), new Stabilizer(1, [1, 0], [0, 1])],
            [new Stabilizer(1, [0, 0], [1, 0]), new Stabilizer(1, [0, 0], [1, 0])],
            [new Stabilizer(1, [0, 1], [0, 0]), new Stabilizer(1, [0, 1], [1, 0])],
            [new Stabilizer(1, [0, 0], [0, 1]), new Stabilizer(1, [0, 0], [0, 1])]
        ], affectedQubits);
        super(affectedQubits, assets, actionTable);
    }
}

export class Measurement extends Gate {
    measurementOperator: Stabilizer;

    constructor(measurementOperator: Stabilizer) {
        // TODO: Affected qubits can be derived from the stabilizer
        super([], ["standard_measure.png"], new ActionTable([], []));
        this.affectedQubits = [];
        this.measurementOperator = measurementOperator;
    }

    override simulate(input: Stabilizer[]): Stabilizer[] {
        // Check if measurement operator is in the stabilizer subspace => measurement result is deterministic
        if (isInStabilizerSubspace(this.measurementOperator, input)) {
            // Calculate measurement outcome by checking if +P (=0) is in the stabilizer subspace or -P(=1)
            // TODO: Move this to a dedicated function
            let basisMatrix = input.map(stabilizer => stabilizer.x_part.concat(stabilizer.z_part));
            const A = math.transpose(math.matrix(basisMatrix));
            const A_pinv = math.pinv(A);
            const measurementOperatorVector = this.measurementOperator.x_part.concat(this.measurementOperator.z_part);
            const b = math.matrix(measurementOperatorVector);
            const solution = math.multiply(A_pinv, b).toArray().map(x => Number(x));
            // Check if b equals A * x
            if (math.norm(math.subtract(b, math.multiply(A, solution))) == 0) {
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
                    // If they anti-commute, add the product of the two to the stabilizers
                    if (!this.measurementOperator.commutes_with(input[i])) {
                        postMeasurementStabilizers.push(input[i].add(input[antiCommutesIndex]));
                    } else {
                        postMeasurementStabilizers.push(input[i]);
                    }
                }
            }
            // 4. Set anti-commuting generator to measurement operator with phase depending on measurement result
            this.measurementOperator.phase = result == 0 ? 1 : -1;
            postMeasurementStabilizers.push(this.measurementOperator);
            return postMeasurementStabilizers;
        }
    }
}

export function isInStabilizerSubspace(stabilizer: Stabilizer, generators: Stabilizer[]): boolean {
    return generators.every(generator => generator.commutes_with(stabilizer));
}
