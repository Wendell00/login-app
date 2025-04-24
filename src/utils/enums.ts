export enum CookieKey {
    AccessToken = 'ACCESS_TOKEN',
    RefreshToken = 'REFRESH_TOKEN',
    Locale = 'NEXT_LOCALE',
    Session = "SESSION",
    Username = "USERNAME",
  }

  export enum ActionResult {
    Success,
    ApiError,
    ServerError,
    NotFound,
    LimitExceeded,
    BadRequest,
    NewPasswordRequired
  }