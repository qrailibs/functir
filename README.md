# About

_Functir_ is a functional programming library for JavaScript/TypeScript. True functional programming in JS! Or probably "mix of things from Scala that now works in JS!".

Also _Functir_ is actually production-ready library with zero dependencies, native implementations, full support of TypeScript and of course with full immutability.

### Installation

- [Installation](#installation)

### Data types

- [`Box`](#box)
- [`Option` (`None`, `Some`)](#option)
- [`Either` (`Left`, `Right`)](#either)
- [`LikeBox`](#likebox)
- [`Seq`](#seq)
- [`Trait`](#trait)
- [`IO`, `AsyncIO`](#io)
- [`Throwable`](#throwable)
- [`Action`](#action)

### Features

- [Pattern matching](#pattern-matching)
- [Piping](#piping)

# Installation

via pnpm:

```bash
pnpm add functir
```

via npm:

```bash
npm i functir
```

# Core data types

## `Box`

Box is super simple – it's class that containing some immutable value.
You cannot change box wrapped value directly, but you can transform it and get new Box instance.

```ts
import { Box } from 'functir'

// 1. Let's create wrapped number value
const wrapped = new Box(1)
console.log(wrapped.value) // 1

// 2. Let's change it (immutable!)
const wrappedTransformed = wrapped.mutate(_ => _ + 100)
console.log(wrappedTransformed.value) // 101
```

Other types described in future also will also use `Box` to contain some value via class construction.

## `Option`
Mostly `Option` data type is used in pattern matching (described in future). `Option` is primary designed to be one of two values: `None` or `Some(value)`. `Some` value is works same as `Box` – wraps some value.

```ts
import { Option, None, Some } from 'functir'

// Both of values is Option<number>
const valueOne: Option<number> = None()
const valueTwo: Option<number> = Some(200)

// You can mutate value of `Some` by converting to `Box`
console.log(valueTwo.asBox) // Box(200)
console.log(valueTwo.asBox.mutate(_ => _ + 5)) // Box(205)
```

## `Either`

The `Either<TLeft, TRight>` is very similar to `Option`, but the value can be `Left(value: TLeft)` or `Right(value: TRight)`:

```ts
import { Either, Left, Right } from 'functir'

// Either<number, string> = Left<number> | Right<string>
// Both of values is Either<number, string>
const valueOne: Either<number, string> = Left(100)
const valueTwo: Either<number, string> = Right('200')

// You can mutate value by converting to `Box`
console.log(valueOne.asBox) // Box(100)
console.log(valueOne.asBox.mutate(_ => _ + 5)) // Box(105)
```

## `LikeBox`
What does `Box`, `Option`, `Either` have in common? - they are all implements `LikeBox` interface, but in different variations.
We have 3 main variations of `LikeBox` interface:
- `LikeBox` (`None` type uses it, it doesn't have wrapped value inside)
- `LikeFilledBox` (`Box` type uses it, inherits `LikeBox` but have wrapped value inside)
- `LikeConvertibleFilledBox` (`Option` & `Either` types uses it, inherits `LikeFilledBox` but have `asBox` converter inside)

How you can use those interfaces? Like that:

```ts
import { Box } from 'functir'

class SomeValue extends Box.filled<number> {}

const wrapped = new SomeValue(200)
console.log(wrapped.value) // 200
console.log(wrapped.asBox) // Box(200)
```

Illustrated code produces for you a `LikeConvertibleFilledBox` class with wrapped `number`, that you can use. The same thing does `None`, `Some`, `Left`, `Right` implementation.

Now let's see what functions does `LikeBox` provides:

### Usage: `match`/`pipe`
Shorthand for using pattern matching or piping:

```ts
import { Option, None, Some, match, is } from 'functir'

const boxNone: Option<number> = None()
const boxSome: Option<number> = Some(200)

// `.match`/`.pipe` – this functions is works on
// `Box`, `Option`, `Either`, `Box.filled<T>`
// becase they are `LikeBox` implementations

// Pattern matching
boxNone.match([
	is(None, _ => "none"),
	is(Some, _ => "some")
]) // none
boxSome.match([
	is(None, _ => "none"),
	is(Some, _ => "some")
]) // some

// Piping
boxSome.pipe([
	_ => _ + 100, // 200 + 100 = 300
	_ => _ + 50 // 300 + 50 = 350
]) // 350
```

### Usage: `flatten`
This magic function is just flattens wrapped `LikeBox` values:

```ts
import { Box, Some } from 'functir'

// `Box` inside `Box` nested 
const deep = new Box(new Box(5))
console.log(deep.flatten()) // 5

// Different `LikeBox` implementations nested
const complexDeep = new Box(new Some(new Box(new Some(20))))
console.log(complexDeep.flatten()) // 20
```

## `Seq`
`Seq` (Sequence) is helpful data type that you can use as alternative for arrays. Why `Seq` instead of arrays?
1. `Seq` is fully immutable-safe (doesn't provides any mutable methods)
2. `Seq` provides a lot of methods that arrays doesn't

Usage is simple:
```ts
import { Seq } from 'functir'

const seq = new Seq<number>(1, 2, 3)

console.log(seq.asArray) // [1, 2, 3]
```

## Usage: methods
`Seq` provides many different immutable methods you can use:

```ts
// Just copies current sequence
seq.copy() // Seq(1, 2, 3)
```

```ts
// Converting into array, set, map
seq.asArray // [1, 2, 3]
seq.asSet // Set(1, 2, 3)
seq.asMap // Map({ 0: 1, 1: 2, 2: 3 })
```

```ts
// Adds value to start of seq
seq.prepended(10) // Seq(10, 1, 2, 3)

// Adds value to end of seq
seq.appended(10) // Seq(1, 2, 3, 10)
```

```ts
// Auto sorting, like [].sort()
seq.autoSorted() // Seq(1, 2, 3)

// Sort using predicate
seq.sorted((a, b) => (a > b ? -1 : 1)) // Seq(3, 2, 1)
```

```ts
// Reverses values
seq.reversed() // Seq(3, 2, 1)
```

```ts
// Maps values
seq.mapped(_ => _ + 10) // Seq(11, 12, 13)
```

```ts
// Accumulated values (For example, sum of values)
seq.accumulated(([acc, _]) => acc + _, 0) // 6
```

```ts
// Filters values
seq.filtered(_ => _ > 1) // Seq(2, 3)
```

```ts
// Pads from start with value (to length of 6)
seq.padStart(6, -1) // Seq(-1, -1, -1, 1, 2, 3)

// Pads from end with value (to length of 6)
seq.padEnd(6, -1) // Seq(1, 2, 3, -1, -1, -1)
```

```ts
// Patches some amount of values from index with value
// From index 1, Amount of 2, With value -1
seq.patched(1, 2, -1) // Seq(1, -1, -1)
```

```ts
// Get index of item (from start)
new Seq(1, 1, 1).indexOf(1) // 0

// Get index of item (from end)
new Seq(1, 1, 1).lastIndexOf(1) // 2
```

## `Trait`
Trait is the concept from `Scala`/`Rust` languages. Using `Trait` you can easily create class (*DTO/DAO*) for some data model:

```ts
import { Trait } from 'functir'

// Create a class using trait
// Trait will automatically create immutable fields, constructor for the class
const UserDTO = Trait<{
	readonly nickname: string
	readonly age: number
}>();

// Create instance of trait
// All fields of trait should be passed to constructor
const jake = new UserDTO({
	nickname: 'Jake',
	age: 20
})

// You can convert trait instances into objects or `Box`
console.log(jake.asObject) // { nickname: 'Jake', age: 20 }
console.log(jake.asBox) // Box({ nickname: 'Jake', age: 20 )
```

`Trait` of course produces immutable classes (with `copy` method), you can use that for creating services:
```ts
import { Trait, Seq } from 'functir'

/**
 * Immutable service that builds pizza
 */
class PizzaService extends Trait<{
    readonly size: 'sm' | 'md' | 'lg';
    readonly toppings: Seq<'meat' | 'pineapple' | 'cheese'>;
}>() {
	constructor() {
		super({
			size: 'sm',
			toppings: new Seq()
		})
	}

    public setSize = (size: 'sm' | 'md' | 'lg') =>
		this.copy({ size })
	
    public addTopping = (topping: 'meat' | 'pineapple' | 'cheese') =>
        this.copy({ toppings: this.toppings.appended(topping) })
}

// Immutability! Let's build pizza
const myPizza = new PizzaService()
	.setSize('md')
	.addTopping('meat')
	.addTopping('cheese')
	.asObject

console.log(myPizza) // { size: 'md', toppings: ['meat', 'cheese'] }
```

## `IO`
`IO` is also another helpful type for defining input and output of function:

```ts
import { IO } from 'functir'

// Operation that converts string to number
const toNumber: IO<string, number> = 
	_ => parseInt(_)

console.log(toNumber('123')) // 123
```

Also if function is async you can use `AsyncIO`:

```ts
import { AsyncIO } from 'functir'

// Operation that async (just return input as output)
const someFunction: AsyncIO<string, string> =
	async _ => _
```

There's third parameter in IO that we didn't mentioned, it's used to define what `Throwable` (described below) can be given by function:

```ts
import { IO, ThrowableTrait } from 'functir'

// Our own throwable error
class TooLongError extends ThrowableTrait('MyOwnError', 'Value was too long') {}

// Our operation described:
// input = string, output = string, throws = MyOwnError
// if input length < 5 we return it, otherwise TooLongError given
const someFunction: IO<string, string, TooLongError> =
	_ => _.length < 5 ? _ : new TooLongError
```

## `Throwable`
The `Throwable` is the helpful type used with `IO` to annotate what error can happen in a function:

```ts
import { Throwable, ThrowableTrait } from 'functir'

// Simple error
const someError: Throwable = new Error('Some custom throwed error')
```

Also you can create own throwable error class using `ThrowableTrait`:

```ts
import { Throwable, ThrowableTrait } from 'functir'

// Create own throwable error
class CustomError extends ThrowableTrait('CustomError') {}

// Our custom error
const someError2: Throwable = new CustomError('Some super custom error')
```

# Core features

## Pattern matching
Pattern matching if well-known pattern that allows to match value to a different cases like in a `switch-case`, but more clean syntax and ability to check for instances of classes.

Example:
```ts
import { match, is, _, Some, None } from 'functir'

// 1 if Some
// 0 if None
// -1 otherwise
const result = match(Some(100))([
	is(Some, _ => 1),
	is(None, _ => 0),
	is(_, _ => -1)
])

console.log(result) // 1
```

The `_` is special symbol used to handle case none of cases is matched.

The case matching is perfectly works for:
– `Either`
– `Option`
– `Trait`
– Classes
– Primitives
– RegExps

## Piping
Will be described later.