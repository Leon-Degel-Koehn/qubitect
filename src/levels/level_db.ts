import { DeutschAlgorithmUnbalanced } from "./deutsch_algorithm.js";
import { Teleportation } from "./teleportation.js";
import { BasicGates } from "./basic_gates.js";
import { BellstatePreparation } from "./bell_state_preparation.js";
import { SuperdenseCoding } from "./superdense_coding.js";

export const LEVELS = [
    BasicGates,
    BellstatePreparation,
    SuperdenseCoding,
    Teleportation,
    DeutschAlgorithmUnbalanced,
];
