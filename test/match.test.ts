import { describe, expect, test } from "@jest/globals";

import {
    _,
    Failure,
    is,
    Left,
    match,
    None,
    Right,
    Some,
    Success,
    ThrowableTrait,
    Trait,
    Safecall,
} from "../src";

describe("Testing match", () => {
    test("Try match RegExp", () => {
        const cases = [
            is(/^\d+$/g, (_) => "number"),
            is(/^\w+$/g, (_) => "text"),
            is(_, (_) => "else"),
        ];

        // Test values
        expect(match("100")(cases)).toEqual("number");
        expect(match("hello")(cases)).toEqual("text");
        expect(match("100days")(cases)).toEqual("else");
    });
    test("Try match Option (Some/None)", () => {
        const cases = [
            is(Some, (_) => "some"),
            is(None, (_) => "none"),
            is(_, (_) => "else"),
        ];

        // Test values
        expect(match(new Some(100))(cases)).toEqual("some");
        expect(match(new None())(cases)).toEqual("none");
        expect(match("something else")(cases)).toEqual("else");
    });
    test("Try match Either (Left/Right)", () => {
        const cases = [
            is(Left, (_) => "left"),
            is(Right, (_) => "right"),
            is(_, (_) => "else"),
        ];

        // Test values
        expect(match(new Left(100))(cases)).toEqual("left");
        expect(match(new Right(100))(cases)).toEqual("right");
        expect(match("something else")(cases)).toEqual("else");
    });
    test("Try match Try (Success/Failure)", () => {
        const cases = [
            is(Success, (_) => "success"),
            is(Failure, (_) => "failure"),
            is(_, (_) => "else"),
        ];

        // Test values
        expect(match(Safecall(() => 100))(cases)).toEqual("success");
        expect(
            match(
                Safecall(() => {
                    throw new Error("Something happen");
                })
            )(cases)
        ).toEqual("failure");
        expect(match("something else")(cases)).toEqual("else");
    });
    test("Try match Error", () => {
        class CustomError extends ThrowableTrait("CustomError") {}

        const cases = [is(Error, (_) => "error"), is(_, (_) => "else")];

        // Test values
        expect(match(new Error("Something happen"))(cases)).toEqual("error");
        expect(match(new CustomError("Something happen"))(cases)).toEqual(
            "error"
        );
        expect(match("something else")(cases)).toEqual("else");
    });
    test("Try match traits", () => {
        type IMessage = {
            readonly text: string;
        };

        const SpeakMessage = Trait<IMessage>();
        const EchoMessage = Trait<IMessage>();

        const cases = [
            is(SpeakMessage, (_) => "speak"),
            is(EchoMessage, (_) => "echo"),
            is(_, (_) => "else"),
        ];

        // Test values
        expect(match(new SpeakMessage({ text: "hey" }))(cases)).toEqual(
            "speak"
        );
        expect(match(new EchoMessage({ text: "heyo" }))(cases)).toEqual("echo");
        expect(match(1)(cases)).toEqual("else");
    });
});
