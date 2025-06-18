<div align="center">

# 🎟️ Valipass

[![npm version][npm_badge]][npm]
[![CI status][ci_badge]][ci]

Collection of password validation actions for [Valibot][valibot] schemas

</div>

---

## 📦 Installation

> [!Note]
>
> This library is distributed only as an ESM module.

```sh
$ npm install valipass
```

or:

```sh
$ yarn add valipass
```

## 🔧 Usage

Example usage with Valibot:

```ts
import * as v from "valibot";
import { password } from "valipass";

const loginSchema = v.object({
  username: v.pipe(v.string(), v.email()),
  password: password()
});

const result = v.safeParse(loginSchema, {
  username: "user@example.com",
  password: "secret"
});
```

Will yield the following result with issues:

```ts
{
  typed: true,
  success: false,
  output: { username: 'user@example.com', password: 'secret' },
  issues: [
    {
      kind: 'validation',
      type: 'min_length',
      input: 'secret',
      expected: '>=8',
      received: '6',
      message: 'Invalid length: Expected >=8 but received 6',
      requirement: 8,
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {...},
          key: 'password',
          value: 'secret'
        }
      ],
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined
    },
    {
      kind: 'validation',
      type: 'min_uppercase',
      input: 'secret',
      expected: '>=1',
      received: '6',
      message: 'Invalid count: Expected >=1 but received 6',
      requirement: 1,
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {...},
          key: 'password',
          value: 'secret'
        }
      ],
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined
    },
    {
      kind: 'validation',
      type: 'min_numbers',
      input: 'secret',
      expected: '>=1',
      received: '6',
      message: 'Invalid count: Expected >=1 but received 6',
      requirement: 1,
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {...},
          key: 'password',
          value: 'secret'
        }
      ],
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined
    },
    {
      kind: 'validation',
      type: 'min_symbols',
      input: 'secret',
      expected: '>=1',
      received: '6',
      message: 'Invalid count: Expected >=1 but received 6',
      requirement: 1,
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {...},
          key: 'password',
          value: 'secret'
        }
      ],
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined
    }
  ]
}
```

Override the default rules:

```ts
import * as v from "valibot";
import { password } from "valipass";

const loginSchema = v.object({
  username: v.pipe(v.string(), v.email()),
  // by default, a password is expected to be between 8 and 250 characters
  // here, we set that to between 16 and 32 characters, and add a
  // space-separated "words" requirement
  password: v.pipe(password({ min: 16, max: 32 }), v.minWords(`en`, 5))
});

const result = v.safeParse(loginSchema, {
  username: "user@example.com",
  password: "Min word requirement 1!"
});
```

Will yield the following result with a minimum words issue:

```ts
{
  typed: true,
  success: false,
  output: {
    username: 'user@example.com',
    password: 'Min word requirement 1!'
  },
  issues: [
    {
      kind: 'validation',
      type: 'min_words',
      input: 'Min word requirement 1!',
      expected: '>=5',
      received: '4',
      message: 'Invalid words: Expected >=5 but received 4',
      requirement: 5,
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {...},
          key: 'password',
          value: 'Min word requirement 1!'
        }
      ],
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined
    }
  ]
}
```

Pick and choose your password rules:

```ts
import * as v from "valibot";
import { minLowercase, minUppercase, minNumbers, minSymbols, maxRepeating } from "valipass";

const passwordSchema = v.pipe(
  v.string(),
  // has a minimum length of 8 characters
  v.minLength(8),
  // has a maximum length of 32 characters
  v.maxLength(32),
  // must contain a lowercase character
  minLowercase(1),
  // must contain an uppercase character
  minUppercase(1),
  // must use at least one number
  minNumbers(1),
  // must use at least one symbol
  minSymbols(1),
  // don't allow more than 2 repeated characters in a row
  maxRepeating(2)
);

const loginSchema = v.pipe(
  v.object({
    username: v.pipe(v.string(), v.email()),
    password1: passwordSchema,
    password2: v.string()
  }),
  v.forward(
    v.partialCheck(
      [["password1"], ["password2"]],
      (input) => input.password1 === input.password2,
      "The two passwords do not match."
    ),
    ["password2"]
  )
);

const result = v.safeParse(loginSchema, {
  username: "user@example.com",
  password1: "val!dPassw0rd",
  password2: "invalidPassword"
});
```

Will yield the following result with a partial_check issue:

```ts
{
  typed: true,
  success: false,
  output: {
    username: 'user@example.com',
    password1: 'val!dPassw0rd',
    password2: 'invalidPassword'
  },
  issues: [
    {
      kind: 'validation',
      type: 'partial_check',
      input: {
        username: 'user@example.com',
        password1: 'val!dPassw0rd',
        password2: 'invalidPassword'
      },
      expected: null,
      received: 'Object',
      message: 'The two passwords do not match.',
      path: [
        {
          type: 'unknown',
          origin: 'value',
          input: {...},
          key: 'password2',
          value: 'invalidPassword'
        }
      ],
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      requirement: λ
    }
  ]
}
```

## 🧰 API

### `password()`

A Password schema with some sensible defaults which can be overriden when providing an optional configuration object.

By default, a password must meet these requirements:

- must be a string
- contain at least 8 characters
- contain at most 250 characters
- contain at least 1 lowercase letter
- contain at least 1 uppercase letter
- contain at least 1 number
- contain at least 1 symbol

**Options:**

```ts
interface PasswordOptions {
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
```

**Override Example:**

```ts
const customPasswordSchema = password({ min: 6, max: 16 });
```

### `minLowercase(requirement: number = 1, message?: string)`

Creates a min lowercase validation action.

```ts
const schema = v.pipe(v.string(), minLowercase(3, "More lowercase characters required!"));
```

### `minUppercase(requirement: number = 1, message?: string)`

Creates a min uppercase validation action.

```ts
const schema = v.pipe(v.string(), minUppercase(3, "More uppercase characters required!"));
```

### `minNumbers(requirement: number = 1, message?: string)`

Creates a min numbers validation action.

```ts
const schema = v.pipe(v.string(), minNumbers(3, "More number characters required!"));
```

### `minSymbols(requirement: number = 1, message?: string)`

Creates a min symbols validation action.

```js
const schema = v.pipe(v.string(), minSymbols(3, "More symbol characters required!"));
```

### `maxRepeating(requirement: number = 2, message?: string)`

Creates a max repeating validation action.

```js
const schema = v.pipe(v.string(), maxRepeating(3, "Too many repeated characters in a row!"));
```

## 📣 Acknowledgements

Valipass' implementation is based on [`yup-password`][yup-password]

## 🥂 License

Released under the [MIT license][license] © [Drake Costa][personal-website].

[npm]: https://www.npmjs.com/package/valipass
[npm_badge]: https://img.shields.io/npm/v/valipass.svg?style=flat
[ci]: https://github.com/saeris/valipass/actions/workflows/ci.yml
[ci_badge]: https://github.com/saeris/valipass/actions/workflows/ci.yml/badge.svg
[valibot]: https://github.com/fabian-hiller/valibot
[yup-password]: https://github.com/knicola/yup-password
[license]: ./LICENSE.md
[personal-website]: https://saeris.gg
