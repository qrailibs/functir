import { describe, expect, test } from "@jest/globals";

import { _, pipe, Seq, Some } from "../src";

const seq = new Seq(1, 2, 3, 4, 5);

describe("Testing pipe", () => {
    test("Try pipe primitives", () => {
        // Test values, try to add 100 and multiply by 2
        expect(pipe(1)([(v) => v + 100, (v) => v * 2])).toEqual((1 + 100) * 2);
    });
    test("Try pipe Box", () => {
        // Test values, try to add 100 and multiply by 2
        expect(new Some(1).pipe([(v) => v + 100, (v) => v * 2])).toEqual(
            (1 + 100) * 2
        );
    });
    test("Try pipe Seq", () => {
        // Test values, try to append 10 and after 20
        expect(
            (
                pipe(seq)([
                    (v) => v.appended(10),
                    (v) => v.appended(20),
                ]) as Seq<number>
            ).asArray
        ).toEqual(seq.appended(10, 20).asArray);
    });
    test("Try pipe with errors", () => {
        // Test values, try to append 100 and throw error
        expect(
            pipe(1)([
                (v) => v + 100,
                (v) => {
                    throw new Error(v.toString());
                },
                (v) => v - 100,
            ])
        ).toBeInstanceOf(Error);
    });
});
