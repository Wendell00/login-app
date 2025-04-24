'use server';

import {
  AdminInitiateAuthCommand,
  AuthFlowType,
  LimitExceededException,
  NotAuthorizedException,
  RespondToAuthChallengeCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { cookies } from 'next/headers';

import { cognito } from '@/utils/cognito';
import { ActionResult, CookieKey } from '@/utils/enums';
import {calculateSecretHash } from '@/utils/helpers';


const { env } = process;

export async function signIn(
  username: string,
  password: string,
): Promise<ActionResult> {

  const secretHash = calculateSecretHash(username,
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
    console.log('response', response);
    if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      (await cookies()).set(CookieKey.Session, response.Session as string)
      return ActionResult.NewPasswordRequired;
    }
    return ActionResult.Success;
  } catch (error) {
    console.log(error);
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
  console.log(username)
  const secretHash = calculateSecretHash(username,
    process.env.AWS_COGNITO_CLIENT_ID!,
    process.env.AWS_COGNITO_CLIENT_SECRET!);

    console.log((await cookies()).get(CookieKey.Session)?.value, 'session')

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
    const finalResponse = await cognito.send(respondCommand);
    console.log('response', finalResponse);
    return ActionResult.Success;
  } catch (error) {
    console.log(error);
    if (error instanceof LimitExceededException) {
      return ActionResult.LimitExceeded;
    } else if (error instanceof NotAuthorizedException) {
      return ActionResult.BadRequest;
    } else {
      return ActionResult.ServerError;
    }
  }

}

// export async function refreshToken(): Promise<{
//   accessToken: string;
//   expiresIn: number;
// }> {
//   const refresh = cookies().get(CookieKey.RefreshToken)?.value;
//   const userId = cookies().get(CookieKey.UserId);
//   const user = await getUserById(userId?.value ?? '');

//   if (!refresh) {
//     throw new NotFoundToken('Not found refresh token');
//   }

//   const input: AdminInitiateAuthCommandInput = {
//     AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
//     ClientId: env.FRONTEND_COGNITO_CLIENT_ID,
//     UserPoolId: env.COGNITO_USER_POOL_ID,
//     AuthParameters: {
//       REFRESH_TOKEN: refresh,
//       SECRET_HASH: await generateSecretHash(
//         user?.user_name ?? '',
//         process.env.FRONTEND_COGNITO_CLIENT_ID!,
//         process.env.FRONTEND_COGNITO_CLIENT_SECRET!
//       )
//     }
//   };

//   const command = new AdminInitiateAuthCommand(input);
//   const response = await cognito.send(command);

//   if (
//     !response.AuthenticationResult?.AccessToken ||
//     !response.AuthenticationResult?.ExpiresIn
//   ) {
//     throw new NotFoundToken('Not found cognito access token');
//   }

//   return {
//     accessToken: response.AuthenticationResult.AccessToken,
//     expiresIn: response.AuthenticationResult.ExpiresIn
//   };
// }

// export async function decodeToken(
//   token?: string
// ): Promise<CognitoAccessTokenPayload> {
//   const accessToken = token
//     ? token
//     : cookies().get(CookieKey.AccessToken)?.value;

//   if (!accessToken) {
//     throw new NotFoundToken();
//   }

//   const verifier = CognitoJwtVerifier.create({
//     userPoolId: env.COGNITO_USER_POOL_ID,
//     clientId: env.FRONTEND_COGNITO_CLIENT_ID,
//     tokenUse: 'access'
//   });

//   try {
//     return await verifier.verify(accessToken);
//   } catch (error) {
//     const newToken = await refreshToken();
//     return await verifier.verify(newToken.accessToken);
//   }
// }

// export async function sendRecoveryAccountPassword(
//   username: string,
//   email: string
// ): Promise<ActionResult> {
//   const updateUserCommand = new AdminUpdateUserAttributesCommand({
//     UserPoolId: env.COGNITO_USER_POOL_ID,
//     Username: username,
//     UserAttributes: [
//       {
//         Name: 'email',
//         Value: email
//       },
//       {
//         Name: 'email_verified',
//         Value: 'true'
//       }
//     ]
//   });

//   try {
//     await cognito.send(updateUserCommand);
//   } catch (error) {
//     return ActionResult.ApiError;
//   }

//   const command = new ForgotPasswordCommand({
//     ClientId: env.FRONTEND_COGNITO_CLIENT_ID,
//     SecretHash: await generateSecretHash(
//       username,
//       process.env.FRONTEND_COGNITO_CLIENT_ID!,
//       process.env.FRONTEND_COGNITO_CLIENT_SECRET!
//     ),
//     Username: username
//   });

//   try {
//     await cognito.send(command);
//     return ActionResult.Success;
//   } catch (error) {
//     if (error instanceof LimitExceededException) {
//       return ActionResult.LimitExceeded;
//     } else {
//       return ActionResult.ApiError;
//     }
//   }
// }


// export async function createNewPassword(
//   username: string,
//   code: string,
//   password: string,
//   locale: string
// ): Promise<ActionResult | undefined> {
//   const { t } = await getTranslation(locale, ['zod']);
//   const input: ConfirmForgotPasswordCommandInput = {
//     ClientId: env.FRONTEND_COGNITO_CLIENT_ID,
//     ConfirmationCode: code,
//     Password: password,
//     Username: username
//   };

//   const command = new ConfirmForgotPasswordCommand(input);
//   let errorMessage = '';

//   try {
//     await cognito.send(command);
//     return ActionResult.Success;
//   } catch (error) {
//     if (
//       error instanceof CodeMismatchException ||
//       error instanceof ExpiredCodeException
//     ) {
//       errorMessage = t('zod:code.invalid');
//     } else if (error instanceof LimitExceededException) {
//       return ActionResult.LimitExceeded;
//     } else {
//       return ActionResult.ApiError;
//     }
//   }

//   redirect(
//     `/${locale}${routes.auth.forgotPasswordCode(
//       stringToBase64(username)
//     )}?error=${errorMessage}&code=${code}`,
//     RedirectType.replace
//   );
// }

