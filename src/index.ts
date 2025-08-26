// Core
import { match, is, _ } from "./core/match";
import { pipe, PipeEmptyError } from "./core/pipe";
import { flatten } from "./core/flatten";

// Types
import {
    Box,
    LikeBox,
    LikeFilledBox,
    LikeConvertibleFilledBox,
} from "./types/Box";
import { Option, None, Some } from "./types/Option";
import { Either, Left, Right } from "./types/Either";
import { ImmutableArray, Seq, UntypedSeq } from "./types/Seq";
import { Trait } from "./types/Trait";
import { Safecall, Try, Success, Failure } from "./types/Try";
import { IO, AsyncIO } from "./types/IO";
import { Throwable, ThrowableTrait } from "./types/Throwable";
// import { Action } from "./types/Action";

// Utility types
import { Awaitable } from "./utils/Awaitable";
import { Ctor, CtorWithArgs } from "./utils/Ctor";
import { Immutable } from "./utils/Immutable";

export {
    // Pattern matching
    match,
    is,
    _,

    // Piping
    pipe,
    PipeEmptyError,

    // Error handlers

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
    ImmutableArray,
    Seq,
    UntypedSeq,

    // Trait
    Trait,

    // Throwable
    Throwable,
    ThrowableTrait,

    // Safecall
    Safecall,
    Try,
    Success,
    Failure,

    // IO
    IO,
    AsyncIO,

    // Utility types
    Awaitable,
    Ctor,
    CtorWithArgs,
    Immutable,
};
