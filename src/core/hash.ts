/**
 * Calculates sum of character to form a hash
 *
 * @param str string to calculate sum
 * @returns the sum of characters
 */
function charsum(str: string): number {
    return new Array(str).reduce(
        (prev, s, sIdx) => prev + s.charCodeAt(sIdx) * (sIdx + 1),
        0
    );
}

/**
 * Calculates hash for array of string
 *
 * @since 1.3.2
 * @param arr array of string to create hash for
 * @returns hashed array
 */
export function arrayHash(arr: string[]): number {
    const sum = arr.reduce((prev, s) => prev + 65027 / charsum(s), 0);
    return parseFloat(("" + sum).slice(0, 16));
}
