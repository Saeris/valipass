import { type BaseIssue, type BaseValidation, type ErrorMessage, _addIssue } from "valibot";

/**
 * Min lowercase issue interface.
 */
export interface MinLowercaseIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: `validation`;
  /**
   * The issue type.
   */
  readonly type: `min_lowercase`;
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
 * Min lowercase action interface.
 */
export interface MinLowercaseAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends ErrorMessage<MinLowercaseIssue<TInput, TRequirement>> | undefined
> extends BaseValidation<TInput, TInput, MinLowercaseIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: `min_lowercase`;
  /**
   * The action reference.
   */
  readonly reference: typeof minLowercase;
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
 * Creates a min lowercase validation action.
 *
 * @param requirement The minimum number of lowercase letters.
 *
 * @returns A min lowercase action.
 */
export function minLowercase<TInput extends string, const TRequirement extends number>(
  requirement: TRequirement
): MinLowercaseAction<TInput, TRequirement, undefined>;

/**
 * Creates a min lowercase validation action.
 *
 * @param requirement The minimum number of lowercase letters.
 * @param message The error message.
 *
 * @returns A min lowercase action.
 */
export function minLowercase<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends ErrorMessage<MinLowercaseIssue<TInput, TRequirement>> | undefined
>(requirement: TRequirement, message: TMessage): MinLowercaseAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function minLowercase(
  requirement: number = 1,
  message?: ErrorMessage<MinLowercaseIssue<string, number>>
): MinLowercaseAction<string, number, ErrorMessage<MinLowercaseIssue<string, number>> | undefined> {
  return {
    kind: `validation`,
    type: `min_lowercase`,
    reference: minLowercase,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    "~run"(dataset, config) {
      if (
        dataset.typed &&
        typeof dataset.value === `string` &&
        (dataset.value.match(/[a-z]/g) ?? []).length < this.requirement
      ) {
        _addIssue(this, `count`, dataset, config, {
          received: `${dataset.value.length}`
        });
      }
      return dataset;
    }
  };
}
