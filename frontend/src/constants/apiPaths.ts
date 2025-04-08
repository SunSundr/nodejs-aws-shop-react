const apiUrl = 'https://xcunh9a844.execute-api.eu-north-1.amazonaws.com/dev';

const API_PATHS = {
  product: apiUrl,
  order: apiUrl,
  import: 'https://387mfqhlx3.execute-api.eu-north-1.amazonaws.com/dev',
  bff: apiUrl,
  cart: apiUrl,
  subscribe: 'https://xcunh9a844.execute-api.eu-north-1.amazonaws.com/dev',
};

export default API_PATHS;

export const RESERVED_ID_PREFIX = '7567ec4b-b10c-45c5-9345-fc73c48a80';

export const LOCALSTORAGE_AUTH_TOKEN_KEY = 'authorization_token';

const clientId = '6herb483m1sk3mhg2hui2p6vfc';
const cognitoDomain = 'https://sunsundr-auth.auth.eu-north-1.amazoncognito.com';
export const COGNITO_AUTH_CONFIG = {
  authority: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_az0zQqLAU',
  client_id: clientId,
  redirect_uri: `${window.location.origin}/login`,
  response_type: 'code',
  scope: 'email openid profile',
  automaticSilentRenew: true,
  loadUserInfo: true,
  // userStore: new WebStorageStateStore({
  //   store: localStorage,
  // }),
};
export const LOGOUT_URL = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(`${window.location.origin}/logout`)}`;
