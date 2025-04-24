import { signIn, createNewPassword, refreshToken, decodeToken } from '../authentication';
import { cookies } from 'next/headers';
import { generateSecretHash } from '@/utils/helpers';
import { cognito } from '@/utils/cognito';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { ActionResult, CookieKey } from '@/utils/enums';
import { NotFoundToken } from '@/utils/exceptions';
import { LimitExceededException, NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';

jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('../../utils/helpers', () => ({ generateSecretHash: jest.fn() }));
jest.mock('../../utils/cognito', () => ({ cognito: { send: jest.fn() } }));
jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: { create: jest.fn() }
}));

describe('Auth Actions', () => {
  let getMock: jest.Mock;
  let setMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getMock = jest.fn();
    setMock = jest.fn();
    (cookies as jest.Mock).mockReturnValue({ get: getMock, set: setMock });
    (generateSecretHash as jest.Mock).mockResolvedValue('mockSecretHash');
  });

  describe('signIn', () => {
    it('returns NewPasswordRequired and sets session cookie when challenge NEW_PASSWORD_REQUIRED', async () => {
      (cognito.send as jest.Mock).mockResolvedValue({
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        Session: 'mockSession'
      });

      const result = await signIn('user', 'pass');

      expect(result).toBe(ActionResult.NewPasswordRequired);
      expect(setMock).toHaveBeenCalledWith(CookieKey.Session, 'mockSession');
    });

    it('returns Success and sets access, refresh, username cookies when authenticated', async () => {
      (cognito.send as jest.Mock).mockResolvedValue({
        AuthenticationResult: { AccessToken: 'access', RefreshToken: 'refresh' }
      });

      const result = await signIn('user', 'pass');

      expect(result).toBe(ActionResult.Success);
      expect(setMock).toHaveBeenCalledWith(CookieKey.AccessToken, 'access');
      expect(setMock).toHaveBeenCalledWith(CookieKey.RefreshToken, 'refresh');
      expect(setMock).toHaveBeenCalledWith(CookieKey.Username, 'user');
    });

    it('returns LimitExceeded on LimitExceededException', async () => {
      (cognito.send as jest.Mock).mockRejectedValue(
        new LimitExceededException({ $metadata: {}, message: 'Limit exceeded' })
      );

      const result = await signIn('user', 'pass');

      expect(result).toBe(ActionResult.LimitExceeded);
    });

    it('returns BadRequest on NotAuthorizedException', async () => {
      (cognito.send as jest.Mock).mockRejectedValue(
        new NotAuthorizedException({ $metadata: {}, message: 'Not authorized' })
      );

      const result = await signIn('user', 'pass');

      expect(result).toBe(ActionResult.BadRequest);
    });

    it('returns ServerError on other errors', async () => {
      (cognito.send as jest.Mock).mockRejectedValue(new Error('test error'));

      const result = await signIn('user', 'pass');

      expect(result).toBe(ActionResult.ServerError);
    });
  });

  describe('createNewPassword', () => {
    it('returns Success on successful password update', async () => {
      (cognito.send as jest.Mock).mockResolvedValue({});
      const result = await createNewPassword('user', 'newPass');

      expect(result).toBe(ActionResult.Success);
    });

    it('returns LimitExceeded on LimitExceededException', async () => {
      (cognito.send as jest.Mock).mockRejectedValue(
        new LimitExceededException({ $metadata: {}, message: 'Limit exceeded' })
      );
      const result = await createNewPassword('user', 'newPass');

      expect(result).toBe(ActionResult.LimitExceeded);
    });

    it('returns BadRequest on NotAuthorizedException', async () => {
      (cognito.send as jest.Mock).mockRejectedValue(
        new NotAuthorizedException({ $metadata: {}, message: 'Not authorized' })
      );
      const result = await createNewPassword('user', 'newPass');

      expect(result).toBe(ActionResult.BadRequest);
    });

    it('returns ServerError on other errors', async () => {
      (cognito.send as jest.Mock).mockRejectedValue(new Error('update error'));
      const result = await createNewPassword('user', 'newPass');

      expect(result).toBe(ActionResult.ServerError);
    });
  });

  describe('refreshToken', () => {
    it('throws NotFoundToken if no refresh token in cookies', async () => {
      getMock.mockReturnValue(undefined);

      await expect(refreshToken()).rejects.toThrow(NotFoundToken);
    });

    it('returns new accessToken and expiresIn on success', async () => {
      getMock.mockImplementation((key) => {
        if (key === CookieKey.RefreshToken) return { value: 'oldRefresh' };
        if (key === CookieKey.Username) return { value: 'user' };
        return undefined;
      });
      (cognito.send as jest.Mock).mockResolvedValue({
        AuthenticationResult: { AccessToken: 'newAccess', ExpiresIn: 900 }
      });

      const result = await refreshToken();
      expect(result).toEqual({ accessToken: 'newAccess', expiresIn: 900 });
    });

    it('throws NotFoundToken if response missing tokens', async () => {
      getMock.mockImplementation((key) => key === CookieKey.RefreshToken ? { value: 'r' } : { value: 'u' });
      (cognito.send as jest.Mock).mockResolvedValue({});

      await expect(refreshToken()).rejects.toThrow(NotFoundToken);
    });
  });

  describe('decodeToken', () => {
    it('throws NotFoundToken if no access token available', async () => {
      getMock.mockReturnValue(undefined);

      await expect(decodeToken()).rejects.toThrow(NotFoundToken);
    });

    it('verifies and returns payload for valid token argument', async () => {
      const verifyMock = jest.fn().mockResolvedValue({ sub: '123' });
      (CognitoJwtVerifier.create as jest.Mock).mockReturnValue({ verify: verifyMock });

      const payload = await decodeToken('testToken');
      expect(verifyMock).toHaveBeenCalledWith('testToken');
      expect(payload).toEqual({ sub: '123' });
    });
  });
});
