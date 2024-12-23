import { describe, expect, test } from "@jest/globals";

import { _, is, match, Some, None, Trait, Left, Right } from "../src";

describe("Testing match", () => {
    test("Try match primitives", () => {
        const cases = [is(100, (_) => "100"), is(200, (_) => "200"), is(_, (_) => "else")];

        // Test values
        expect(match(100)(cases)).toEqual("100");
        expect(match(200)(cases)).toEqual("200");
        expect(match(1)(cases)).toEqual("else");
    });
    test("Try match with regexp", () => {
        const cases = [is(/^\d+$/g, (_) => "number"), is(/^\w+$/g, (_) => "text"), is(_, (_) => "else")];

        // Test values
        expect(match("100")(cases)).toEqual("number");
        expect(match("hello")(cases)).toEqual("text");
        expect(match("100days")(cases)).toEqual("else");
    });
    test("Try match options", () => {
        const cases = [is(Left, (_) => "left"), is(Right, (_) => "right"), is(_, (_) => "else")];

        // Test values
        expect(match(new Left(1))(cases)).toEqual("left");
        expect(match(new Right(1))(cases)).toEqual("right");
        expect(match(1)(cases)).toEqual("else");
    });
    test("Try match eithers", () => {
        const cases = [is(Some, (_) => "some"), is(None, (_) => "none"), is(_, (_) => "else")];

        // Test values
        expect(match(new Some(1))(cases)).toEqual("some");
        expect(match(new None())(cases)).toEqual("none");
        expect(match(1)(cases)).toEqual("else");
    });
    test("Try match traits", () => {
        type IMessage = {
            readonly text: string;
        };

        const SpeakMessage = Trait<IMessage>();
        const EchoMessage = Trait<IMessage>();

        const cases = [is(SpeakMessage, (_) => "speak"), is(EchoMessage, (_) => "echo"), is(_, (_) => "else")];

        // Test values
        expect(match(new SpeakMessage({ text: "hey" }))(cases)).toEqual("speak");
        expect(match(new EchoMessage({ text: "heyo" }))(cases)).toEqual("echo");
        expect(match(1)(cases)).toEqual("else");
    });
});
