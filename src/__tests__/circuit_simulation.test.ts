import {TestLevel} from '../levels/simplest.js';
import {Session} from '../levels/types.js';
import {
    Circuit,
    Stabilizer,
    PauliX,
    PauliZ,
    Hadamard,
    PauliY,
    Measurement,
    ControlledPauliX,
    isInStabilizerSubspace, ControlledPauliZ
} from '../types.js';

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
    test('CNOT flips target qubit if control qubit is in |1> state', () => {
        const gates = [new ControlledPauliX(0, 1)];
        const circuit = new Circuit(2, gates);
        const stabilizer = [new Stabilizer(1, [0, 0], [0, 1]), new Stabilizer(-1, [0, 0], [1, 0])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(2);
        const expectedStabilizer = [new Stabilizer(1, [0, 0], [1, 1]), new Stabilizer(-1, [0, 0], [1, 0])];
        expect(expectedStabilizer.every(generator => isInStabilizerSubspace(generator, result))).toBe(true);
    });
    test('CNOT acts as identity if control qubit is in |0> state', () => {
        const gates = [new ControlledPauliX(0, 1)];
        const circuit = new Circuit(2, gates);
        const stabilizer = [new Stabilizer(1, [0, 0], [1, 0]), new Stabilizer(1, [0, 0], [0, 1])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(2);
        expect(result[0].phase).toBe(1);
        expect(result[1].phase).toBe(1);
        expect(stabilizer.every(generator => isInStabilizerSubspace(generator, result))).toBe(true);
    });
    test('CZ flips |+> to |-> state', () => {
        const gates = [new ControlledPauliZ(0, 1)];
        const circuit = new Circuit(2, gates);
        const stabilizer = [new Stabilizer(-1, [0, 0], [1, 0]), new Stabilizer(1, [0, 1], [0, 0])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(2);
        const expectedStabilizer = [new Stabilizer(-1, [0, 0], [1, 0]), new Stabilizer(-1, [0, 1], [0, 0])];
        expect(expectedStabilizer.every(generator => isInStabilizerSubspace(generator, result))).toBe(true);
    });
    test('CZ acts as identity if control qubit is in |0> state', () => {
        const gates = [new ControlledPauliZ(0, 1)];
        const circuit = new Circuit(2, gates);
        const stabilizer = [new Stabilizer(1, [0, 0], [1, 0]), new Stabilizer(1, [0, 1], [0, 0])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(2);
        expect(result[0].phase).toBe(1);
        expect(result[1].phase).toBe(1);
        expect(stabilizer.every(generator => isInStabilizerSubspace(generator, result))).toBe(true);
    });
    test('Construct Bell-State using Hadamard and CNOT', () => {
        const gates = [new Hadamard(0), new ControlledPauliX(0, 1)];
        const circuit = new Circuit(2, gates);
        const stabilizer = [new Stabilizer(1, [0, 0], [1, 0]), new Stabilizer(1, [0, 0], [0, 1])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(2);
        const expectedStabilizer = [new Stabilizer(1, [0, 0], [1, 1]), new Stabilizer(1, [1, 1], [0, 0])];
        expect(expectedStabilizer.every(generator => isInStabilizerSubspace(generator, result))).toBe(true);
    });
    test('Basic level circuit outputs correct result', () => {
        const circuit = TestLevel.circuit;
        const stabilizer = TestLevel.inputState;
        const expectedResult = TestLevel.expectedResult;
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(expectedResult.length);
        expectedResult.forEach((stabilizer) => {
            expect(result).toContainEqual(stabilizer);
        })
    });
    test('Basic level with placeholders outputs correct result', () => {
        const levelSession = new Session(TestLevel);
        const circuit = levelSession.displayedCircuit;
        const stabilizer = TestLevel.inputState;
        const expectedResult = [
            new Stabilizer(-1, [0, 0], [1, 0]),
            new Stabilizer(1, [0, 0], [0, 1]),
        ]
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(expectedResult.length);
        expectedResult.forEach((stabilizer) => {
            expect(result).toContainEqual(stabilizer);
        })
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
    test('Post-measurement state of superposition corresponds to measurement outcome', () => {
        const measurementOutcome = Math.random() > 0.5 ? 0 : 1;
        global.Math.random = () => measurementOutcome;
        const gates = [new Measurement(new Stabilizer(1, [1], [0]))];
        const circuit = new Circuit(1, gates);
        const stabilizer = [new Stabilizer(1, [0], [1])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(1);
        expect(result[0].phase).toBe(measurementOutcome === 0 ? 1 : -1);
        expect(result[0].x_part).toEqual([1]);
        expect(result[0].z_part).toEqual([0]);
    });
    test('Measurement of bell state in computational basis', () => {
        const measurementOutcome = Math.random() > 0.5 ? 0 : 1;
        global.Math.random = () => measurementOutcome;

        const resultingPhase = measurementOutcome === 0 ? 1 : -1;
        const measurementOperator = new Stabilizer(1, [0, 0], [1, 0]);
        const gates = [new Measurement(measurementOperator)];
        const circuit = new Circuit(2, gates);
        const stabilizer = [new Stabilizer(1, [0, 0], [1, 1]), new Stabilizer(1, [1, 1], [0, 0])];
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(2);
        expect(isInStabilizerSubspace(measurementOperator, result)).toBe(true);
        // TODO: Check measurement outcome by calculating the phase of the stabilizer
    });

})