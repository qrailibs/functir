// Core
import { match, is, _ } from "./core/match";
import { pipe, PipeEmptyError } from "./core/pipe";
import { flatten } from "./core/flatten";

// Types
import { Box, LikeBox, LikeFilledBox, LikeConvertibleFilledBox } from "./types/Box";
import { Option, None, Some } from "./types/Option";
import { Either, Left, Right } from "./types/Either";
import { Seq, UntypedSeq } from "./types/Seq";
import { Trait } from "./types/Trait";
import { Throwable, ThrowableTrait } from "./types/Throwable";
import { IO, AsyncIO } from "./types/IO";

// Utility types
import { Ctor, CtorWithArgs } from "./utils/Ctor";

export {
    // Pattern matching
    match,
    is,
    _,

    // Piping
    pipe,
    PipeEmptyError,

    // Other functions
    flatten,

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

    // Seq
    Seq,
    UntypedSeq,

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
