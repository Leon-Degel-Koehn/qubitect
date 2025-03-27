import {
    DeutschAlgorithmBalanced,
    DeutschAlgorithmUnbalanced,
} from "../levels/deutsch_algorithm.js";
import { isInStabilizerSet } from "../utils.js";
import { SuperdenseCoding } from "../levels/superdense_coding.js";
import { BasicGates } from "../levels/basic_gates.js";

describe("Level tests", () => {
    test("Deutsch's algorithm balanced oracle function", () => {
        const circuit = DeutschAlgorithmBalanced.circuit;
        const stabilizer = DeutschAlgorithmBalanced.inputState;
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(
            DeutschAlgorithmBalanced.expectedResult.length,
        );
        DeutschAlgorithmBalanced.expectedResult.forEach((stabilizer) => {
            expect(isInStabilizerSet(stabilizer, result)).toBe(true);
        });
    });
    test("Deutsch's algorithm unbalanced oracle function", () => {
        const circuit = DeutschAlgorithmUnbalanced.circuit;
        const stabilizer = DeutschAlgorithmUnbalanced.inputState;
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(
            DeutschAlgorithmUnbalanced.expectedResult.length,
        );
        DeutschAlgorithmUnbalanced.expectedResult.forEach((stabilizer) => {
            expect(isInStabilizerSet(stabilizer, result)).toBe(true);
        });
    });
    test("Superdense coding protocol", () => {
        const circuit = SuperdenseCoding.circuit;
        const stabilizer = SuperdenseCoding.inputState;
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(SuperdenseCoding.expectedResult.length);
        SuperdenseCoding.expectedResult.forEach((stabilizer) => {
            expect(isInStabilizerSet(stabilizer, result)).toBe(true);
        });
    });
    test("Basic gate functionality", () => {
        const circuit = BasicGates.circuit;
        const stabilizer = BasicGates.inputState;
        const result = circuit.simulate(stabilizer);
        expect(result.length).toBe(BasicGates.expectedResult.length);
        BasicGates.expectedResult.forEach((stabilizer) => {
            expect(isInStabilizerSet(stabilizer, result)).toBe(true);
        });
    });
});
