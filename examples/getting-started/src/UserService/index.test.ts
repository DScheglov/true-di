import { describe, it, expect } from '@jest/globals';
import { UserService } from '.';

describe('UserService', () => {
  describe('getCurrentUser', () => {
    it('returns the User if token is correct', async () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNvbWUtdXNlci1pZCIsImVtYWlsIjoic29tZS11c2VyQGVtYWlsLm5vdCIsImlzUHJlZmVycmVkQ3VzdG9tZXIiOnRydWV9.K4TrvKFYjjcxZ-auoziZkkSiarnoYYfFHXLfbI1yrTs';
      const userService = new UserService();
      userService.setToken(validToken);
      await expect(userService.getCurrentUser()).resolves.toEqual({
        id: 'some-user-id',
        email: 'some-user@email.not',
        isPreferredCustomer: true,
      });
    });

    it('returns null if token is invalid', async () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.CiAgICAgICAgaWQ6ICdzb21lLXVzZXItaWQnLAogICAgICAgIGVtYWlsOiAnc29tZS11c2VyQGVtYWlsLm5vdCcsCiAgICAgICAgaXNQcmVmZXJyZWRDdXN0b21lcjogdHJ1ZSwK.K4TrvKFYjjcxZ-auoziZkkSiarnoYYfFHXLfbI1yrTs';
      const userService = new UserService();
      userService.setToken(invalidToken);
      await expect(userService.getCurrentUser()).resolves.toEqual(null);
    });

    it('returns null if token is null', async () => {
      const userService = new UserService();
      userService.setToken(null);
      await expect(userService.getCurrentUser()).resolves.toEqual(null);
    });
  });
});
