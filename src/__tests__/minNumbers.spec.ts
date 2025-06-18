import type { StringIssue } from "valibot";
import { minNumbers, type MinNumbersAction, type MinNumbersIssue } from "../minNumbers.js";
import { expectNoActionIssue } from "./utils/expectNoActionIssue.js";
import { expectActionIssue } from "./utils/expectActionIssue.js";

describe(`minNumbers`, () => {
  describe(`should return action object`, () => {
    const baseAction: Omit<MinNumbersAction<string, 5, never>, `message`> = {
      kind: `validation`,
      type: `min_numbers`,
      reference: minNumbers,
      expects: `>=5`,
      requirement: 5,
      async: false,
      "~run": expect.any(Function)
    };

    it(`with undefined message`, () => {
      const action: MinNumbersAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined
      };
      expect(minNumbers(5)).toStrictEqual(action);
      expect(minNumbers(5, undefined)).toStrictEqual(action);
    });

    it(`with string message`, () => {
      expect(minNumbers(5, `message`)).toStrictEqual({
        ...baseAction,
        message: `message`
      } satisfies MinNumbersAction<string, 5, string>);
    });

    it(`with function message`, () => {
      const message = () => `message`;
      expect(minNumbers(5, message)).toStrictEqual({
        ...baseAction,
        message
      } satisfies MinNumbersAction<string, 5, typeof message>);
    });
  });

  describe(`should return dataset without issues`, () => {
    const action = minNumbers(5);

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
      expectNoActionIssue(action, [`12345`, `123456`, `f00b4rb4z123`]);
    });
  });

  describe(`should return dataset with issues`, () => {
    const action = minNumbers(5, `message`);
    const baseIssue: Omit<MinNumbersIssue<string, 5>, `input` | `received`> = {
      kind: `validation`,
      type: `min_numbers`,
      expected: `>=5`,
      message: `message`,
      requirement: 5
    };

    it(`for invalid strings`, () => {
      expectActionIssue(action, baseIssue, [``, `foo`, `1234`], (value) => `${value.length}`);
    });
  });
});
