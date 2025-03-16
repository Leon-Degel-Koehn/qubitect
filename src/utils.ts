import { Stabilizer, KetState, KetZero, Circuit, Gate } from "./types.js";

function stabilizerIsSubset(superset: Stabilizer[], subset: Stabilizer[]): boolean {
	for (let subsetGenerator of subset) {
		for (let supersetGenerator of superset) {
			if (supersetGenerator.commutes_with(subsetGenerator))
				return false;
		}
	}
	return true;
}

const cartesian = <T>(...arrays: T[][]): T[][] => {
	return arrays.reduce<T[][]>(
		(acc, curr) => acc.flatMap(d => curr.map(e => [...(Array.isArray(d) ? d : [d]), e])),
		[[]] as T[][] // Initialize with an empty array inside another array
	);
};

const cartesianPower = (array: KetState[], n: number): KetState[][] => {
	if (n <= 0) return [[]]; // Base case: Cartesian product of zero arrays is [[]]

	return Array.from({ length: n }).reduce<KetState[][]>(
		acc => acc.flatMap(d => array.map(e => [...d, e])),
		[[]] // Start with an array containing an empty array
	);
};

export function stateFromStabilizer(stabilizer: Stabilizer[]) {
	// const num_qubits = stabilizer[0].x_part.length;
	// for (let state of cartesianPower(knownStates, num_qubits)) {
	// 	let currStabilizer: Stabilizer[] = []
	// 	for (let substate of state) {
	// 		currStabilizer = currStabilizer.concat(substate.stabilizer);
	// 	}
	// }
	// return UnknownKetState;
	// TODO: implement, this is just dummy
	const num_qubits = stabilizer[0].x_part.length;
	return Array(num_qubits).fill(KetZero);
}
