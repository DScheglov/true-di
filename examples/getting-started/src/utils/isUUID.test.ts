import { isUUID } from './isUUID';

describe('isUUID', () => {
  it.each([
    ['25c6633c-08c4-45ec-b553-d70106963c14', true],
    ['25c6633c-08c4-45ec-b553-d70106963c14'.toUpperCase(), true],
    ['60e660b7-6833-443f-a736-dd1e2ab37649', true],
    ['23cfab4d-103b-475f-830a-79e7f8c93c05', true],
    ['', false],
    ['25c6633c-08c4-45ec-b553-d70106963c1Z', false],
    ['25c6633c-08c4-45ec-d70106963c14', false],
    ['25c6633c-08c4-45ec-b553-d70106963c142-12313123', false],
  ])("isUUID('%s') is %s", (value, expected) => {
    expect(isUUID(value)).toBe(expected);
  });
});
