import { type BaseIssue, type BaseValidation, type ErrorMessage, _addIssue } from "valibot";

/**
 * Min numbers issue interface.
 */
export interface MinNumbersIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: `validation`;
  /**
   * The issue type.
   */
  readonly type: `min_numbers`;
  /**
   * The expected property.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The minimum expected value.
   */
  readonly requirement: TRequirement;
}

/**
 * Min numbers action interface.
 */
export interface MinNumbersAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends ErrorMessage<MinNumbersIssue<TInput, TRequirement>> | undefined
> extends BaseValidation<TInput, TInput, MinNumbersIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: `min_numbers`;
  /**
   * The action reference.
   */
  readonly reference: typeof minNumbers;
  /**
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum expected value.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a min numbers validation action.
 *
 * @param requirement The minimum number of numbers.
 *
 * @returns A min numbers action.
 */
export function minNumbers<TInput extends string, const TRequirement extends number>(
  requirement: TRequirement
): MinNumbersAction<TInput, TRequirement, undefined>;

/**
 * Creates a min numbers validation action.
 *
 * @param requirement The minimum number of numbers.
 * @param message The error message.
 *
 * @returns A min numbers action.
 */
export function minNumbers<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends ErrorMessage<MinNumbersIssue<TInput, TRequirement>> | undefined
>(requirement: TRequirement, message: TMessage): MinNumbersAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function minNumbers(
  requirement: number = 1,
  message?: ErrorMessage<MinNumbersIssue<string, number>>
): MinNumbersAction<string, number, ErrorMessage<MinNumbersIssue<string, number>> | undefined> {
  return {
    kind: `validation`,
    type: `min_numbers`,
    reference: minNumbers,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    "~run"(dataset, config) {
      if (
        dataset.typed &&
        typeof dataset.value === `string` &&
        (dataset.value.match(/[0-9]/g) ?? []).length < this.requirement
      ) {
        _addIssue(this, `count`, dataset, config, {
          received: `${dataset.value.length}`
        });
      }
      return dataset;
    }
  };
}
