'use server';

import {
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandInput,
  AuthFlowType,
  LimitExceededException,
  NotAuthorizedException,
  RespondToAuthChallengeCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { cookies } from 'next/headers';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { cognito } from '@/utils/cognito';
import { ActionResult, CookieKey } from '@/utils/enums';
import { generateSecretHash } from '@/utils/helpers';
import { NotFoundToken } from '@/utils/exceptions';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';


const { env } = process;

export async function signIn(
  username: string,
  password: string,
): Promise<ActionResult> {

  const secretHash = await generateSecretHash(username,
    process.env.AWS_COGNITO_CLIENT_ID!,
    process.env.AWS_COGNITO_CLIENT_SECRET!);

  const command = new AdminInitiateAuthCommand({
    AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
    ClientId: env.AWS_COGNITO_CLIENT_ID,
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: secretHash
    }
  });

  try {
    const response = await cognito.send(command);
    if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      (await cookies()).set(CookieKey.Session, response.Session as string)
      return ActionResult.NewPasswordRequired;
    }
    (await cookies()).set(CookieKey.AccessToken, response.AuthenticationResult?.AccessToken as string);
    (await cookies()).set(CookieKey.RefreshToken, response.AuthenticationResult?.RefreshToken as string);
    (await cookies()).set(CookieKey.Username, username);
    return ActionResult.Success;
  } catch (error) {
    if (error instanceof LimitExceededException) {
      return ActionResult.LimitExceeded;
    } else if (error instanceof NotAuthorizedException) {
      return ActionResult.BadRequest;
    } else {
      return ActionResult.ServerError;
    }
  }
}

export async function createNewPassword(
  username: string,
  password: string,
): Promise<ActionResult> {
  const secretHash = await generateSecretHash(username,
    process.env.AWS_COGNITO_CLIENT_ID!,
    process.env.AWS_COGNITO_CLIENT_SECRET!);

    const respondCommand = new RespondToAuthChallengeCommand({
      ClientId: env.AWS_COGNITO_CLIENT_ID!,
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      Session: (await cookies()).get(CookieKey.Session)?.value,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });
    

  try {
    await cognito.send(respondCommand);
    return ActionResult.Success;
  } catch (error) {
    if (error instanceof LimitExceededException) {
      return ActionResult.LimitExceeded;
    } else if (error instanceof NotAuthorizedException) {
      return ActionResult.BadRequest;
    } else {
      return ActionResult.ServerError;
    }
  }

}

export async function refreshToken(): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  const refresh =  (await cookies()).get(CookieKey.RefreshToken)?.value;
  const username = (await cookies()).get(CookieKey.Username);

  if (!refresh) {
    throw new NotFoundToken('Not found refresh token');
  }

  const secretHash = await generateSecretHash(username?.value ?? "",
    process.env.AWS_COGNITO_CLIENT_ID!,
    process.env.AWS_COGNITO_CLIENT_SECRET!);

  const input: AdminInitiateAuthCommandInput = {
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: env.AWS_COGNITO_CLIENT_ID,
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    AuthParameters: {
      REFRESH_TOKEN: refresh,
      SECRET_HASH: secretHash
    }
  };

  const command = new AdminInitiateAuthCommand(input);
  const response = await cognito.send(command);

  if (
    !response.AuthenticationResult?.AccessToken ||
    !response.AuthenticationResult?.ExpiresIn
  ) {
    throw new NotFoundToken('Not found cognito access token');
  }

  return {
    accessToken: response.AuthenticationResult.AccessToken,
    expiresIn: response.AuthenticationResult.ExpiresIn
  };
}

export async function decodeToken(
  token?: string
): Promise<CognitoAccessTokenPayload> {
  const accessToken = token
    ? token
    :  (await cookies()).get(CookieKey.AccessToken)?.value;

  if (!accessToken) {
    throw new NotFoundToken();
  }

  const verifier = CognitoJwtVerifier.create({
    userPoolId: env.AWS_COGNITO_USER_POOL_ID,
    clientId: env.AWS_COGNITO_CLIENT_ID,
    tokenUse: 'access'
  });

  try {
    return await verifier.verify(accessToken);
  } catch {
    const newToken = await refreshToken();
    return await verifier.verify(newToken.accessToken);
  }
}




