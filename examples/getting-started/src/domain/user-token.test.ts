import { describe, it, expect } from '@jest/globals';
import { parseToken } from './user-token';

describe('userToken', () => {
  describe('parseToken', () => {
    it('returns the parsed object if token is correct', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNvbWUtdXNlci1pZCIsImVtYWlsIjoic29tZS11c2VyQGVtYWlsLm5vdCIsImlzUHJlZmVycmVkQ3VzdG9tZXIiOnRydWV9.K4TrvKFYjjcxZ-auoziZkkSiarnoYYfFHXLfbI1yrTs';
      expect(parseToken(validToken)).toEqual({
        id: 'some-user-id',
        email: 'some-user@email.not',
        isPreferredCustomer: true,
      });
    });

    it('returns null if the parsing is failed', () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.CiAgICAgICAgaWQ6ICdzb21lLXVzZXItaWQnLAogICAgICAgIGVtYWlsOiAnc29tZS11c2VyQGVtYWlsLm5vdCcsCiAgICAgICAgaXNQcmVmZXJyZWRDdXN0b21lcjogdHJ1ZSwK.K4TrvKFYjjcxZ-auoziZkkSiarnoYYfFHXLfbI1yrTs';
      expect(parseToken(invalidToken)).toBeNull();
    });
  });
});
