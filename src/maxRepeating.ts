import { type BaseIssue, type BaseValidation, type ErrorMessage, _addIssue } from "valibot";

/**
 * Max repeating issue interface.
 */
export interface MaxRepeatingIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: `validation`;
  /**
   * The issue type.
   */
  readonly type: `max_repeating`;
  /**
   * The expected property.
   */
  readonly expected: `<=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The maximum expected value.
   */
  readonly requirement: TRequirement;
}

/**
 * Max repeating action interface.
 */
export interface MaxRepeatingAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends ErrorMessage<MaxRepeatingIssue<TInput, TRequirement>> | undefined
> extends BaseValidation<TInput, TInput, MaxRepeatingIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: `max_repeating`;
  /**
   * The action reference.
   */
  readonly reference: typeof maxRepeating;
  /**
   * The expected property.
   */
  readonly expects: `<=${TRequirement}`;
  /**
   * The maximum expected value.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a max repeating validation action.
 *
 * @param requirement The maximum number of repeating characters.
 *
 * @returns A max repeating action.
 */
export function maxRepeating<TInput extends string, const TRequirement extends number>(
  requirement: TRequirement
): MaxRepeatingAction<TInput, TRequirement, undefined>;

/**
 * Creates a max repeating validation action.
 *
 * @param requirement The maximum number of repeating characters.
 * @param message The error message.
 *
 * @returns A max repeating action.
 */
export function maxRepeating<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends ErrorMessage<MaxRepeatingIssue<TInput, TRequirement>> | undefined
>(requirement: TRequirement, message: TMessage): MaxRepeatingAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function maxRepeating(
  requirement: number = 2,
  message?: ErrorMessage<MaxRepeatingIssue<string, number>>
): MaxRepeatingAction<string, number, ErrorMessage<MaxRepeatingIssue<string, number>> | undefined> {
  return {
    kind: `validation`,
    type: `max_repeating`,
    reference: maxRepeating,
    async: false,
    expects: `<=${requirement}`,
    requirement,
    message,
    "~run"(dataset, config) {
      if (
        dataset.typed &&
        typeof dataset.value === `string` &&
        new RegExp(`(.)\\1{${this.requirement},}`).test(dataset.value)
      ) {
        _addIssue(this, `count`, dataset, config, {
          received: `${(new RegExp(`(.)\\1{${this.requirement},}`).exec(dataset.value) ?? [``])[0].length}`
        });
      }
      return dataset;
    }
  };
}
