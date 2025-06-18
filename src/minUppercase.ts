import { type BaseIssue, type BaseValidation, type ErrorMessage, _addIssue } from "valibot";

/**
 * Min uppercase issue interface.
 */
export interface MinUppercaseIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: `validation`;
  /**
   * The issue type.
   */
  readonly type: `min_uppercase`;
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
 * Min uppercase action interface.
 */
export interface MinUppercaseAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends ErrorMessage<MinUppercaseIssue<TInput, TRequirement>> | undefined
> extends BaseValidation<TInput, TInput, MinUppercaseIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: `min_uppercase`;
  /**
   * The action reference.
   */
  readonly reference: typeof minUppercase;
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
 * Creates a min uppercase validation action.
 *
 * @param requirement The minimum number of uppercase letters.
 *
 * @returns A min uppercase action.
 */
export function minUppercase<TInput extends string, const TRequirement extends number>(
  requirement: TRequirement
): MinUppercaseAction<TInput, TRequirement, undefined>;

/**
 * Creates a min uppercase validation action.
 *
 * @param requirement The minimum number of uppercase letters.
 * @param message The error message.
 *
 * @returns A min uppercase action.
 */
export function minUppercase<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends ErrorMessage<MinUppercaseIssue<TInput, TRequirement>> | undefined
>(requirement: TRequirement, message: TMessage): MinUppercaseAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function minUppercase(
  requirement: number = 1,
  message?: ErrorMessage<MinUppercaseIssue<string, number>>
): MinUppercaseAction<string, number, ErrorMessage<MinUppercaseIssue<string, number>> | undefined> {
  return {
    kind: `validation`,
    type: `min_uppercase`,
    reference: minUppercase,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    "~run"(dataset, config) {
      if (
        dataset.typed &&
        typeof dataset.value === `string` &&
        (dataset.value.match(/[A-Z]/g) ?? []).length < this.requirement
      ) {
        _addIssue(this, `count`, dataset, config, {
          received: `${dataset.value.length}`
        });
      }
      return dataset;
    }
  };
}
