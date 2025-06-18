import { parse } from "valibot";
import { password } from "../password.js";

describe(`password`, () => {
  it(`should require at least 8 characters`, () => {
    expect(() => parse(password(), `aB1!`)).toThrow();
    expect(() => parse(password(), `aBCdEF1!`)).not.toThrow();
    expect(() => parse(password(), `has MORE 123 !!`)).not.toThrow();
  });

  it(`should require at most 250 characters`, () => {
    // more than 250
    expect(() =>
      parse(
        password(),
        `Eed7reeve1aiWoo9yoh7aet1vooVeighi7eicho3leicahweim` +
          `eengo4quoo1Chei3aBei0Shaxei0aivei2euNgaiz1eiri6jae` +
          `0af9aighai5eel3chohc1thaeyeisuangooghingohkahr9Giu` +
          `cisiu2neelaiY3meek8aTheith3Ta6eighiehei2ahtheeQuee` +
          `7zuth5te0Ahthaitaequae5ahghairai6Fiu0aisiet9kilad!` +
          `extra`
      )
    ).toThrow();
    // exactly 250
    expect(() =>
      parse(
        password(),
        `Eed7reeve1aiWoo9yoh7aet1vooVeighi7eicho3leicahweim` +
          `eengo4quoo1Chei3aBei0Shaxei0aivei2euNgaiz1eiri6jae` +
          `0af9aighai5eel3chohc1thaeyeisuangooghingohkahr9Giu` +
          `cisiu2neelaiY3meek8aTheith3Ta6eighiehei2ahtheeQuee` +
          `7zuth5te0Ahthaitaequae5ahghairai6Fiu0aisiet9kilad!`
      )
    ).not.toThrow();
    // less than 250, exactly 8
    expect(() => parse(password(), `aBCdEF1!`)).not.toThrow();
    // less than 250, more than 8
    expect(() => parse(password(), `has MORE 123 !!`)).not.toThrow();
  });

  it(`should require at least one lowercase letter`, () => {
    expect(() => parse(password(), `NO LOWERCASE 12 !`)).toThrow();
    expect(() => parse(password(), `HAS oNE 12 !`)).not.toThrow();
    expect(() => parse(password(), `HAS more 12 !`)).not.toThrow();
  });

  it(`should require at least one uppercase letter`, () => {
    expect(() => parse(password(), `no uppercase 12 !`)).toThrow();
    expect(() => parse(password(), `has One 12 !`)).not.toThrow();
    expect(() => parse(password(), `has MORE 12 !`)).not.toThrow();
  });

  it(`should require at least one number`, () => {
    expect(() => parse(password(), `no NUMBER !`)).toThrow();
    expect(() => parse(password(), `has ONE 1 !`)).not.toThrow();
    expect(() => parse(password(), `has MORE 12 !`)).not.toThrow();
  });

  it(`should require at least one symbol`, () => {
    expect(() => parse(password(), `no SYMBOL 12`)).toThrow();
    expect(() => parse(password(), `has ONE 12 !`)).not.toThrow();
    expect(() => parse(password(), `has MORE 12 !!`)).not.toThrow();
  });

  it(`supports user supplied overrides`, () => {
    expect(() => parse(password({ min: 6 }), `aBcD1!`)).not.toThrow();
    expect(() => parse(password({ max: 10 }), `aBcDeFg1!`)).not.toThrow();
    expect(() => parse(password({ lowercase: 2 }), `hAS LESS 1!`)).toThrow();
    expect(() => parse(password({ uppercase: 2 }), `has Less 1!`)).toThrow();
    expect(() => parse(password({ numbers: 3 }), `has LESS 12!`)).toThrow();
    expect(() => parse(password({ symbols: 2 }), `has LESS 123!`)).toThrow();
  });
});
