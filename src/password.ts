import type { SchemaWithPipe, StringSchema, MinLengthAction, MaxLengthAction } from "valibot";
import { pipe, string, minLength, maxLength } from "valibot";
import { minLowercase, type MinLowercaseAction } from "./minLowercase .js";
import { minUppercase, type MinUppercaseAction } from "./minUppercase.js";
import { minNumbers, type MinNumbersAction } from "./minNumbers.js";
import { minSymbols, type MinSymbolsAction } from "./minSymbols.js";

/**
 * Overrides for the default password requirements
 */
export interface PasswordOptions {
  /** Minumum number of characters */
  min?: number;
  /** Maxmimum number of characters */
  max?: number;
  /** Minimum number of lowercase letters */
  lowercase?: number;
  /** Minimum number of uppercase letters */
  uppercase?: number;
  /** Minimum number of number characters */
  numbers?: number;
  /** Minimum number of symbols */
  symbols?: number;
}

/**
 * Password schema
 *
 * @param options An object specifying overrides for the default password requirements
 *
 * By default, a password must meet these requirements:
 * - must be a string
 * - contain at least 8 characters
 * - contain at most 250 characters
 * - contain at least 1 lowercase letter
 * - contain at least 1 uppercase letter
 * - contain at least 1 number
 * - contain at least 1 symbol
 */
// @__NO_SIDE_EFFECTS__
export const password = ({ min, max, lowercase, uppercase, numbers, symbols }: PasswordOptions = {}): SchemaWithPipe<
  readonly [
    StringSchema<undefined>,
    MinLengthAction<string, number, undefined>,
    MaxLengthAction<string, number, undefined>,
    MinLowercaseAction<string, number, undefined>,
    MinUppercaseAction<string, number, undefined>,
    MinNumbersAction<string, number, undefined>,
    MinSymbolsAction<string, number, undefined>
  ]
> =>
  pipe(
    string(),
    minLength(min ?? 8),
    maxLength(max ?? 250),
    minLowercase(lowercase ?? 1),
    minUppercase(uppercase ?? 1),
    minNumbers(numbers ?? 1),
    minSymbols(symbols ?? 1)
  );
