// Core
import { match, is, _ } from "./core/match";

// Types
import { Box } from "./types/Box";
import { None, Some, Option } from "./types/Option";
import { Either, Left, Right } from "./types/Either";
import { Trait } from "./types/Trait";
import { Throwable, ThrowableTrait } from "./types/Throwable";
import { IO } from "./types/IO";

// Utility types
import { Ctor, CtorWithArgs } from "./types/Ctor";

const toNumber: IO<string, number> = (_) => parseInt(_);

console.log(toNumber("123"));

export {
    // Pattern matching
    match,
    is,
    _,

    // Box
    Box,

    // Option
    Option,
    None,
    Some,

    // Either
    Either,
    Left,
    Right,

    // Trait
    Trait,

    // Throwable
    Throwable,
    ThrowableTrait,

    // IO
    IO,

    // Utility types
    Ctor,
    CtorWithArgs,
};
