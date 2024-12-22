import { describe, expect, test } from "@jest/globals";

import { _, is, match, Seq, Trait } from "../src";

describe("Testing match", () => {
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
    });
});
