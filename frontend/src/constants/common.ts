export const STORE_NAME = 'SunSundr★Store';
export const PROD_MOCKS_ENABLE = false;
export const NEW_USER_MARK = 'signupUser';
export const LOGOUT_USER_MARK = 'removeUser';
export const PREFERS_USER_THEME_KEY = 'colorScheme';
export const RESERVED_ID_PREFIX = '7567ec4b-b10c-45c5-9345-fc73c48a80';
export const AUTH_SYNC_CHANNEL_NAME = 'oidc_auth_channel';
export const EMAIL_VERIFY_COUNTDOWN_KEY = 'email_verification_countdown';
export const EMAIL_NEW = 'email_new';

export enum AuthSyncMessage {
  login = 'login',
  logout = 'logout',
  profile = 'profile',
  cart = 'cart',
  products = 'products',
  orders = 'orders',
}
