import { type BaseIssue, type BaseValidation, type ErrorMessage, type OutputDataset, _addIssue } from "valibot";

/**
 * Min symbols issue interface.
 */
export interface MinSymbolsIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: `validation`;
  /**
   * The issue type.
   */
  readonly type: `min_symbols`;
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
 * Min symbols action interface.
 */
export interface MinSymbolsAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends ErrorMessage<MinSymbolsIssue<TInput, TRequirement>> | undefined
> extends BaseValidation<TInput, TInput, MinSymbolsIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: `min_symbols`;
  /**
   * The action reference.
   */
  readonly reference: typeof minSymbols;
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
 * Creates a min symbols validation action.
 *
 * @param requirement The minimum number of symbols.
 *
 * @returns A min symbols action.
 */
export function minSymbols<TInput extends string, const TRequirement extends number>(
  requirement: TRequirement
): MinSymbolsAction<TInput, TRequirement, undefined>;

/**
 * Creates a min symbols validation action.
 *
 * @param requirement The minimum number of symbols.
 * @param message The error message.
 *
 * @returns A min symbols action.
 */
export function minSymbols<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends ErrorMessage<MinSymbolsIssue<TInput, TRequirement>> | undefined
>(requirement: TRequirement, message: TMessage): MinSymbolsAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function minSymbols(
  requirement: number = 1,
  message?: ErrorMessage<MinSymbolsIssue<string, number>>
): MinSymbolsAction<string, number, ErrorMessage<MinSymbolsIssue<string, number>> | undefined> {
  return {
    kind: `validation`,
    type: `min_symbols`,
    reference: minSymbols,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    "~run"(dataset, config): OutputDataset<string, BaseIssue<unknown> | MinSymbolsIssue<string, number>> {
      if (
        dataset.typed &&
        typeof dataset.value === `string` &&
        (dataset.value.match(/[^a-zA-Z0-9\s]/g) ?? []).length < this.requirement
      ) {
        _addIssue(this, `count`, dataset, config, {
          received: `${dataset.value.length}`
        });
      }
      return dataset;
    }
  };
}
