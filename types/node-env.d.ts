declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    AWS_COGNITO_CLIENT_ID: string;
    AWS_COGNITO_USER_POOL_ID: string;
    AWS_COGNITO_CLIENT_SECRET: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
  }
}
