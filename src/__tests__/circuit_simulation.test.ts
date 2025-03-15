import {Circuit, Stabilizer, PauliX, PauliZ, Hadamard, PauliY, Measurement} from '../types.js';

describe('CircuitSimulation tests', () => {
    test('Pauli X is a bit flip for computational basis states', () => {
        const gates = [new PauliX(0)];
        const circuit = new Circuit(1, gates);
        const stabilizer = [new Stabilizer(1, [0], [1])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(-1);
        expect(result[0].x_part).toEqual([0]);
        expect(result[0].z_part).toEqual([1]);
    });
    test('Pauli Z is a bit flip for + and - states', () => {
        const gates = [new PauliZ(0)];
        const circuit = new Circuit(1, gates);
        const stabilizer = [new Stabilizer(1, [1], [0])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(-1);
        expect(result[0].x_part).toEqual([1]);
        expect(result[0].z_part).toEqual([0]);
    });
    test('Pauli Y is a bit flip for computational basis states', () => {
        const gates = [new PauliY(0)];
        const circuit = new Circuit(1, gates);
        const stabilizer = [new Stabilizer(1, [0], [1])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(-1);
        expect(result[0].x_part).toEqual([0]);
        expect(result[0].z_part).toEqual([1]);
    });
    test('Hadamard converts computational basis states to + and - states', () => {
        const gates = [new Hadamard(0)];
        const circuit = new Circuit(1, gates);
        const stabilizer = [new Stabilizer(1, [0], [1])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(1);
        expect(result[0].x_part).toEqual([1]);
        expect(result[0].z_part).toEqual([0]);
    });
    test('Measurement of deterministic state returns same state', () => {
        const gates = [new Measurement(new Stabilizer(1, [0], [1]))];
        const circuit = new Circuit(1, gates);
        const stabilizer = [new Stabilizer(1, [0], [1])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(1);
        expect(result[0].x_part).toEqual([0]);
        expect(result[0].z_part).toEqual([1]);
    });

})