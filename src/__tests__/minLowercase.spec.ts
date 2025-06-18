import type { StringIssue } from "valibot";
import { minLowercase, type MinLowercaseAction, type MinLowercaseIssue } from "../minLowercase .js";
import { expectNoActionIssue } from "./utils/expectNoActionIssue.js";
import { expectActionIssue } from "./utils/expectActionIssue.js";

describe(`minLowercase`, () => {
  describe(`should return action object`, () => {
    const baseAction: Omit<MinLowercaseAction<string, 5, never>, `message`> = {
      kind: `validation`,
      type: `min_lowercase`,
      reference: minLowercase,
      expects: `>=5`,
      requirement: 5,
      async: false,
      "~run": expect.any(Function)
    };

    it(`with undefined message`, () => {
      const action: MinLowercaseAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined
      };
      expect(minLowercase(5)).toStrictEqual(action);
      expect(minLowercase(5, undefined)).toStrictEqual(action);
    });

    it(`with string message`, () => {
      expect(minLowercase(5, `message`)).toStrictEqual({
        ...baseAction,
        message: `message`
      } satisfies MinLowercaseAction<string, 5, string>);
    });

    it(`with function message`, () => {
      const message = () => `message`;
      expect(minLowercase(5, message)).toStrictEqual({
        ...baseAction,
        message
      } satisfies MinLowercaseAction<string, 5, typeof message>);
    });
  });

  describe(`should return dataset without issues`, () => {
    const action = minLowercase(5);

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
      expectNoActionIssue(action, [`valid`, `valid!`, `fooBARbaz123`]);
    });
  });

  describe(`should return dataset with issues`, () => {
    const action = minLowercase(5, `message`);
    const baseIssue: Omit<MinLowercaseIssue<string, 5>, `input` | `received`> = {
      kind: `validation`,
      type: `min_lowercase`,
      expected: `>=5`,
      message: `message`,
      requirement: 5
    };

    it(`for invalid strings`, () => {
      expectActionIssue(action, baseIssue, [``, `foo`, `1234`], (value) => `${value.length}`);
    });
  });
});
