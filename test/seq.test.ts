import { describe, expect, test } from "@jest/globals";

import { ImmutableArray, Seq } from "../src";

// Mock data
const numbers: Seq<number> = new Seq(1, 2, 3, 4, 5);

describe("Testing Seq methods", () => {
    test("Try check immutabillity", () => {
        // Create copy
        const original = numbers.copy();
        const changed = original.appended(6);

        // Test values
        expect(original.asArray).toEqual([1, 2, 3, 4, 5]);
        expect(changed.asArray).toEqual([1, 2, 3, 4, 5, 6]);
    });
    test("Try to copy seq with asArray", () => {
        // Create copy
        const vals = numbers.asArray;

        // Test values
        expect(vals).toEqual([1, 2, 3, 4, 5]);
    });
    test("Try to copy seq with copy()", () => {
        // Create copy
        const copy = numbers.copy();

        // Test values
        expect(copy.asArray).toEqual(numbers.asArray);
    });
    test("Try to add value with appended()", () => {
        // Append a value 6
        const numbersNew = numbers.appended(6);

        // Test values
        expect(numbersNew.asArray).toEqual([1, 2, 3, 4, 5, 6]);
    });
    test("Try to add value with prepended()", () => {
        // Prepend a value 0
        const numbersNew = numbers.prepended(0);

        // Test values
        expect(numbersNew.asArray).toEqual([0, 1, 2, 3, 4, 5]);
    });
    test("Try to filter values with filtered()", () => {
        // Filter values that % 2 = 0
        const { value } = numbers.filtered((_) => _ % 2 === 0);

        // Test values
        expect(value).toHaveProperty("asArray");
        expect((value as Seq<number>).asArray).toEqual([2, 4]);
    });
    test("Try to mutate values with mapped()", () => {
        // Patching 2 values from idx=1 with -1
        const { value } = numbers.mapped((_) => _ + 1);

        // Test values
        expect(value).toHaveProperty("asArray");
        expect((value as Seq<number>).asArray).toEqual([2, 3, 4, 5, 6]);
    });
    test("Try to fill values with padStart()", () => {
        // Padding values to start
        const numbersNew = numbers.padStart(6, -1);

        // Test values
        expect(numbersNew.asArray).toEqual([-1, 1, 2, 3, 4, 5]);
    });
    test("Try to fill values with padEnd()", () => {
        // Padding values to end
        const numbersNew = numbers.padEnd(6, -1);

        // Test values
        expect(numbersNew.asArray).toEqual([1, 2, 3, 4, 5, -1]);
    });
    test("Try to fill values with patched()", () => {
        // Patching 2 values from idx=1 with -1
        const { value } = numbers.patched(1, 2, -1);

        // Test values
        expect(value).toHaveProperty("asArray");
        expect((value as Seq<number>).asArray).toEqual([1, -1, -1, 4, 5]);
    });
    test("Try to remove values with excluded()", () => {
        // Excluding 2 values
        const numbersNew = numbers.excluded(3, 4);

        // Test values
        expect(numbersNew.asArray).toEqual([1, 2, 5]);
    });
});
