import {
    CognitoIdentityProviderClient,
    type CognitoIdentityProviderClientConfig
  } from '@aws-sdk/client-cognito-identity-provider';
  
  const { env } = process;
  
  export const config: CognitoIdentityProviderClientConfig = {
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    }
  };
  
  export const cognito = new CognitoIdentityProviderClient(config);
  