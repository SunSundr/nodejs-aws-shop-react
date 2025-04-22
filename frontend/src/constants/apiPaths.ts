const apiUrl = 'https://xcunh9a844.execute-api.eu-north-1.amazonaws.com/dev';

// Cart Service API (cloudfront for elasticbeanstalk)
// const apiCartCludFrontEBSUrl = 'https://d1wr58fh208zzd.cloudfront.net'; // not used, now accessed via BFF

/** API Service Endpoints Configuration */
const API_PATHS = {
  // --- Active Endpoints ---

  /** BFF Gateway (primary endpoint for most requests) */
  bff: 'https://dens454cy0aoe.cloudfront.net',

  /** Import Service */
  import: 'https://387mfqhlx3.execute-api.eu-north-1.amazonaws.com/dev',

  /**
   * Temporary Order Mock API (admin only)
   * @note Using mock due to incompatibility between
   * PostgreSQL schema requirements and legacy order service
   */
  orderMock: apiUrl,

  // --- Deprecated Endpoints (use BFF instead) ---

  /** @deprecated Product Service - now accessed via BFF */
  // product: apiUrl,

  /** @deprecated Product Service (email subscription) - now accessed via BFF */
  // subscribe: apiUrl,

  /** @deprecated Cart Service - now accessed via BFF */
  // order: `${apiCartCludFrontEBSUrl}/api/profile/cart`,

  /** @deprecated Cart Service - now accessed via BFF */
  // cart: `${apiCartCludFrontEBSUrl}/api`,
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
