import {
    DeutschAlgorithmBalanced,
    DeutschAlgorithmUnbalanced,
} from "../levels/deutsch_algorithm.js";
import { isInStabilizerSet } from "../utils.js";
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
});
