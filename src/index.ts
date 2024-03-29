// Core
import { match, is, _ } from "./core/match";
import { pipe, PipeEmptyError } from "./core/pipe";

// Types
import { Box, LikeBox, LikeFilledBox, LikeConvertibleFilledBox } from "./types/Box";
import { Option, None, Some } from "./types/Option";
import { Either, Left, Right } from "./types/Either";
import { Trait } from "./types/Trait";
import { Throwable, ThrowableTrait } from "./types/Throwable";
import { IO, AsyncIO } from "./types/IO";

// Utility types
import { Ctor, CtorWithArgs } from "./types/Ctor";

export {
    // Pattern matching
    match,
    is,
    _,

    // Piping
    pipe,
    PipeEmptyError,

    // Box
    LikeBox,
    LikeFilledBox,
    LikeConvertibleFilledBox,
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
    AsyncIO,

    // Utility types
    Ctor,
    CtorWithArgs,
};
