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

	}
}

export class Stabilizer {
	phase : number;
	x_part : number[];
	z_part : number[];

	constructor(phase: number, x_par: number[], z_par: number[]) {
		this.phase = phase;
		this.x_part = x_par;
		this.z_part = z_par;
	}

	add(rhs : Stabilizer) : Stabilizer {
		let phase = this.phase * rhs.phase;
		let x_part = this.x_part.map((x, i) => x ^ rhs.x_part[i]);
		let z_part = this.z_part.map((z, i) => z ^ rhs.z_part[i]);
		return new Stabilizer(phase, x_part, z_part);
	}

	commutes_with(rhs : Stabilizer) : boolean {
		return (this.inner_product(this.x_part, rhs.z_part) ^ this.inner_product(this.z_part, rhs.x_part)) == 0;
	}

	inner_product(lhs : number[], rhs : number[]) : number {
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
		let result = [];
		for (let stabilizer of input) {
			let x_part = stabilizer.x_part;
			let z_part = stabilizer.z_part;
			for (let affectedQubit of this.affectedQubits) {
				// Swap the X and Z parts of the stabilizer
				// FIXME: Old stabilizer is not preserved
				let temp = x_part[affectedQubit];
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
		let result = [];
		for (let stabilizer of input) {
			let x_part = stabilizer.x_part;
			let z_part = stabilizer.z_part;
			let phase = stabilizer.phase;
			for (let affectedQubit of this.affectedQubits) {
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
		let result = [];
		for (let stabilizer of input) {
			let x_part = stabilizer.x_part;
			let z_part = stabilizer.z_part;
			let phase = stabilizer.phase;
			for (let affectedQubit of this.affectedQubits) {
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
		let result = [];
		for (let stabilizer of input) {
			let x_part = stabilizer.x_part;
			let z_part = stabilizer.z_part;
			let phase = stabilizer.phase;
			for (let affectedQubit of this.affectedQubits) {
				phase *= -z_part[affectedQubit];
				phase *= -x_part[affectedQubit];
			}
			result.push(new Stabilizer(phase, x_part, z_part));
		}
		return result;
	}
}
