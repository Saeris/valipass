import type { StringIssue } from "valibot";
import { minSymbols, type MinSymbolsAction, type MinSymbolsIssue } from "../minSymbols.js";
import { expectNoActionIssue } from "./utils/expectNoActionIssue.js";
import { expectActionIssue } from "./utils/expectActionIssue.js";

describe(`minSymbols`, () => {
  describe(`should return action object`, () => {
    const baseAction: Omit<MinSymbolsAction<string, 5, never>, `message`> = {
      kind: `validation`,
      type: `min_symbols`,
      reference: minSymbols,
      expects: `>=5`,
      requirement: 5,
      async: false,
      "~run": expect.any(Function)
    };

    it(`with undefined message`, () => {
      const action: MinSymbolsAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined
      };
      expect(minSymbols(5)).toStrictEqual(action);
      expect(minSymbols(5, undefined)).toStrictEqual(action);
    });

    it(`with string message`, () => {
      expect(minSymbols(5, `message`)).toStrictEqual({
        ...baseAction,
        message: `message`
      } satisfies MinSymbolsAction<string, 5, string>);
    });

    it(`with function message`, () => {
      const message = () => `message`;
      expect(minSymbols(5, message)).toStrictEqual({
        ...baseAction,
        message
      } satisfies MinSymbolsAction<string, 5, typeof message>);
    });
  });

  describe(`should return dataset without issues`, () => {
    const action = minSymbols(5);

    it(`for untyped inputs`, () => {
      const issues: [StringIssue] = [
        {
          kind: `schema`,
          type: `string`,
          input: null,
          expected: `string`,
          received: `null`,
          message: `message`
        }
      ];
      expect(
        action[`~run`](
          {
            typed: false,
            value: null,
            issues
          },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: null,
        issues
      });
    });

    it(`for valid strings`, () => {
      expectNoActionIssue(action, [`!@#$%`, `!@#$%^`, `foob@rb@z!@#`]);
    });
  });

  describe(`should return dataset with issues`, () => {
    const action = minSymbols(5, `message`);
    const baseIssue: Omit<MinSymbolsIssue<string, 5>, `input` | `received`> = {
      kind: `validation`,
      type: `min_symbols`,
      expected: `>=5`,
      message: `message`,
      requirement: 5
    };

    it(`for invalid strings`, () => {
      expectActionIssue(action, baseIssue, [``, `foo`, `1234`], (value) => `${value.length}`);
    });
  });
});
