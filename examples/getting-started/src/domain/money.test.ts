import { describe, it, expect } from '@jest/globals';
import {
  money, map, isMoney, USD, EUR, JSONMoneyReplacer,
} from './money';

describe('money', () => {
  describe('money()', () => {
    it('creates a money object', () => {
      const amount = money(100, USD); // 1 United States Dollar
      expect(isMoney(amount)).toBeTruthy();
    });

    it('rounds the amount value passed', () => {
      expect(money(100.1, USD).amount).toBe(100);
    });
  });

  describe('map', () => {
    it.each([
      [money(100, USD), (amount: number) => amount * 2, 200],
      [money(100, USD), (amount: number) => amount / 2, 50],
      [money(100, USD), () => 0, 0],
    ])('map(%j, %s) returns money(%d, USD)', (value, mapper, expected) => {
      expect(map(value, mapper)).toEqual(money(expected, value.currency));
    });
  });

  describe('JSONMoneyReplacer', () => {
    it.each([
      [money(1000, USD), { amount: 10, currency: USD }],
      [money(2899, EUR), { amount: 28.99, currency: EUR }],
    ])('serialized %j to %j', (value, expected) => {
      expect(JSONMoneyReplacer('price', value)).toEqual(expected);
    });

    it.each([
      [0],
      [1000],
      [new Date()],
      [null],
      [{}],
      [[]],
    ])('for %j it returns exectly the same value', (value: any) => {
      expect(JSONMoneyReplacer('price', value)).toBe(value);
    });
  });
});
