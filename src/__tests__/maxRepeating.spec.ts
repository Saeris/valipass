import type { StringIssue } from "valibot";
import { maxRepeating, type MaxRepeatingAction, type MaxRepeatingIssue } from "../maxRepeating.js";
import { expectNoActionIssue } from "./utils/expectNoActionIssue.js";
import { expectActionIssue } from "./utils/expectActionIssue.js";

describe(`maxRepeating`, () => {
  describe(`should return action object`, () => {
    const baseAction: Omit<MaxRepeatingAction<string, 5, never>, `message`> = {
      kind: `validation`,
      type: `max_repeating`,
      reference: maxRepeating,
      expects: `<=5`,
      requirement: 5,
      async: false,
      "~run": expect.any(Function)
    };

    it(`with undefined message`, () => {
      const action: MaxRepeatingAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined
      };
      expect(maxRepeating(5)).toStrictEqual(action);
      expect(maxRepeating(5, undefined)).toStrictEqual(action);
    });

    it(`with string message`, () => {
      expect(maxRepeating(5, `message`)).toStrictEqual({
        ...baseAction,
        message: `message`
      } satisfies MaxRepeatingAction<string, 5, string>);
    });

    it(`with function message`, () => {
      const message = () => `message`;
      expect(maxRepeating(5, message)).toStrictEqual({
        ...baseAction,
        message
      } satisfies MaxRepeatingAction<string, 5, typeof message>);
    });
  });

  describe(`should return dataset without issues`, () => {
    const action = maxRepeating(5);

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
      expectNoActionIssue(action, [``, `foo`, `fooooo`, `aaabacadae`]);
    });
  });

  describe(`should return dataset with issues`, () => {
    const action = maxRepeating(5, `message`);
    const baseIssue: Omit<MaxRepeatingIssue<string, 5>, `input` | `received`> = {
      kind: `validation`,
      type: `max_repeating`,
      expected: `<=5`,
      message: `message`,
      requirement: 5
    };

    it(`for invalid strings`, () => {
      expectActionIssue(
        action,
        baseIssue,
        [`aaaaaa`, `foooooobarbaz123`],
        (value) => `${(new RegExp(`(.)\\1{5,}`).exec(value) ?? [``])[0].length}`
      );
    });
  });
});
