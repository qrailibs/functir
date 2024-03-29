//FIXME: deeply nested object not works
// new Some(new Some(new Box(new Box(20)))

/**
 * Flatten deep structure into primitive
 *
 * @since 1.1.0
 * @param target structure
 * @param nestedKey key in object that contains primitive
 * @returns primitive
 */
export function flatten<TNested, TTarget>(target: TTarget, nestedKey: keyof TTarget): TNested {
    // Not deep -> return
    if (typeof target[nestedKey] !== "object") return target[nestedKey] as unknown as TNested;

    // Maybe deep
    const maybeBox = target[nestedKey] as object;
    if (nestedKey in maybeBox) {
        return flatten<TNested, TTarget>(maybeBox[nestedKey as keyof typeof maybeBox], nestedKey) as TNested;
    } else {
        return target[nestedKey] as TNested;
    }
}
