import {Circuit, Stabilizer, PauliX, PauliZ, Hadamard, PauliY, Measurement} from '../types.js';

describe('CircuitSimulation tests', () => {
    test('Pauli X is a bit flip for computational basis states', () => {
        // Generate test circuit
        let gates = [new PauliX(0)];
        let circuit = new Circuit(1, gates);
        let stabilizer = [new Stabilizer(1, [0], [1])];
        let result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(-1);
        expect(result[0].x_part).toEqual([0]);
        expect(result[0].z_part).toEqual([1]);
    });
    test('Pauli Z is a bit flip for + and - states', () => {
        // Generate test circuit
        let gates = [new PauliZ(0)];
        let circuit = new Circuit(1, gates);
        let stabilizer = [new Stabilizer(1, [1], [0])];
        let result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(-1);
        expect(result[0].x_part).toEqual([1]);
        expect(result[0].z_part).toEqual([0]);
    });
    test('Pauli Y is a bit flip for computational basis states', () => {
        // Generate test circuit
        let gates = [new PauliY(0)];
        let circuit = new Circuit(1, gates);
        let stabilizer = [new Stabilizer(1, [0], [1])];
        let result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(-1);
        expect(result[0].x_part).toEqual([0]);
        expect(result[0].z_part).toEqual([1]);
    });
    test('Hadamard converts computational basis states to + and - states', () => {
        // Generate test circuit
        let gates = [new Hadamard(0)];
        let circuit = new Circuit(1, gates);
        let stabilizer = [new Stabilizer(1, [0], [1])];
        let result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(1);
        expect(result[0].x_part).toEqual([1]);
        expect(result[0].z_part).toEqual([0]);
    });
    test('Measurement of deterministic state returns same state', () => {
        // Generate test circuit
        let gates = [new Measurement(new Stabilizer(1, [0], [1]))];
        let circuit = new Circuit(1, gates);
        let stabilizer = [new Stabilizer(1, [0], [1])];
        let result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(1);
        expect(result[0].x_part).toEqual([0]);
        expect(result[0].z_part).toEqual([1]);
    });

})