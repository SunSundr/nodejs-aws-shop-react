// const apiCartCludFrontEBSUrl = 'https://d1wr58fh208zzd.cloudfront.net';
import { AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

/** BFF Gateway (primary endpoint for most requests) */
const BFF_URL = ''; //'https://dens454cy0aoe.cloudfront.net';

/** API Service Endpoints Configuration */
const API_PATHS = {
  /** Authorization Service */
  profile: 'https://pgil76tu5b.execute-api.eu-north-1.amazonaws.com/prod',

  /** Product Service */
  product: BFF_URL || 'https://xcunh9a844.execute-api.eu-north-1.amazonaws.com/dev',

  /** Cart Service */
  // cart: BFF_URL || 'http://localhost:4000/api',
  // order: BFF_URL || 'http://localhost:4000/api',
  cart: BFF_URL || 'https://rhr37syvgh.execute-api.eu-north-1.amazonaws.com/prod/api',
  order: BFF_URL || 'https://rhr37syvgh.execute-api.eu-north-1.amazonaws.com/prod/api',

  /** Import Service (products)*/
  import: 'https://387mfqhlx3.execute-api.eu-north-1.amazonaws.com/dev',
};

export default API_PATHS;

export const LOCALSTORAGE_AUTH_TOKEN_KEY = 'authorization_token';

const clientId = '34jgvh4dlaqm1ho1m8ht1kksav';
export const COGNITO_DOMAIN = 'https://sunsundr-store.auth.eu-north-1.amazoncognito.com';
export const COGNITO_USER_POOL_ID = 'eu-north-1_Y2O9AT83T';
export const COGNITO_AUTH_CONFIG: AuthProviderProps = {
  authority: `https://cognito-idp.eu-north-1.amazonaws.com/${COGNITO_USER_POOL_ID}`,
  client_id: clientId,
  redirect_uri: `${window.location.origin}/login`,
  post_logout_redirect_uri: `${window.location.origin}/logout`,
  response_type: 'code',
  // scope: 'email openid profile',
  scope: 'email openid profile aws.cognito.signin.user.admin',
  automaticSilentRenew: true,
  loadUserInfo: true,
  // onSigninCallback: () => {
  //   console.log('onSigninCallback');
  //},
  // onSignoutCallback: async () => {
  //   console.log('onSignoutCallback');
  // },
  revokeTokensOnSignout: true,
  revokeTokenTypes: ['refresh_token'],
  userStore: new WebStorageStateStore({
    store: localStorage,
  }),
};

export const LOGOUT_URL = `${COGNITO_DOMAIN}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(`${window.location.origin}/logout`)}`;
