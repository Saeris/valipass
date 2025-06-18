import type { StringIssue } from "valibot";
import { minUppercase, type MinUppercaseAction, type MinUppercaseIssue } from "../minUppercase.js";
import { expectNoActionIssue } from "./utils/expectNoActionIssue.js";
import { expectActionIssue } from "./utils/expectActionIssue.js";

describe(`minUppercase`, () => {
  describe(`should return action object`, () => {
    const baseAction: Omit<MinUppercaseAction<string, 5, never>, `message`> = {
      kind: `validation`,
      type: `min_uppercase`,
      reference: minUppercase,
      expects: `>=5`,
      requirement: 5,
      async: false,
      "~run": expect.any(Function)
    };

    it(`with undefined message`, () => {
      const action: MinUppercaseAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined
      };
      expect(minUppercase(5)).toStrictEqual(action);
      expect(minUppercase(5, undefined)).toStrictEqual(action);
    });

    it(`with string message`, () => {
      expect(minUppercase(5, `message`)).toStrictEqual({
        ...baseAction,
        message: `message`
      } satisfies MinUppercaseAction<string, 5, string>);
    });

    it(`with function message`, () => {
      const message = () => `message`;
      expect(minUppercase(5, message)).toStrictEqual({
        ...baseAction,
        message
      } satisfies MinUppercaseAction<string, 5, typeof message>);
    });
  });

  describe(`should return dataset without issues`, () => {
    const action = minUppercase(5);

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
      expectNoActionIssue(action, [`VALID`, `VALID!`, `FOObarBAz123`]);
    });
  });

  describe(`should return dataset with issues`, () => {
    const action = minUppercase(5, `message`);
    const baseIssue: Omit<MinUppercaseIssue<string, 5>, `input` | `received`> = {
      kind: `validation`,
      type: `min_uppercase`,
      expected: `>=5`,
      message: `message`,
      requirement: 5
    };

    it(`for invalid strings`, () => {
      expectActionIssue(action, baseIssue, [``, `foo`, `1234`], (value) => `${value.length}`);
    });
  });
});
