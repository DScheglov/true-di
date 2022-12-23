export const USD = 840 as const;
export const EUR = 978 as const;
export type Currency =
  | typeof USD
  | typeof EUR;

export const MONEY_TAG = 'money' as const;

export type Money = Readonly<{
  __tag: typeof MONEY_TAG;
  amount: number; // whole number of money
  currency: Currency;
}>;

export const money = (amount: number, currency: Currency): Money => ({
  __tag: MONEY_TAG,
  amount: Math.round(amount),
  currency,
});

export const map = ({ amount, currency }: Money, mapper: (amount: number) => number) =>
  money(
    mapper(amount),
    currency,
  );

export const isMoney = (value: any): value is Money =>
  value != null &&
  typeof value.amount === 'number' &&
  typeof value.currency === 'number' &&
  value.__tag === MONEY_TAG;

export const JSONMoneyReplacer = (key: string, value: any) =>
  (isMoney(value)
    ? { amount: value.amount / 100, currency: value.currency }
    : value);
