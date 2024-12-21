import { describe, expect, test } from "@jest/globals";

import { Seq } from "../src";

// Mock data
const numbers: Seq<number> = new Seq(1, 2, 3, 4, 5);

describe("Testing database copying", () => {
    test("Try to copy seq as array", () => {
        // Create copy
        const vals = numbers.asArray;

        // Test values
        expect(vals).toEqual([1, 2, 3, 4, 5]);
    });
    test("Try to duplicate seq with copy()", () => {
        // Create copy
        const copy = numbers.copy();

        // Test values
        expect(copy.asArray).toEqual(numbers.asArray);
    });
});
