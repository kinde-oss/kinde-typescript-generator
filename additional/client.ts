import { OAuth2Client, OAuth2Token, OAuth2AuthorizationCodeGrant, OAuth2ClientCredentialsGrant } from '@badgateway/oauth2-client';
import { Configuration } from './index';

enum GrantType {
  AUTH_CODE = 'AUTH_CODE',
  CLIENT_CREDENTIALS = 'CLIENT_CREDENTIALS',
}

// Set your global enum value
const grantType: GrantType = GrantType.AUTH_CODE; // or GrantType.CLIENT_CREDENTIALS

// OAuth2 configuration
const oauth2Config = {
  clientId: {process.env.REACT_APP_KINDE_CLIENT_ID},
  clientSecret: 'your_client_secret',
  tokenEndpoint: 'https://your-auth-server.com/oauth/token',
  authorizationEndpoint: 'https://your-auth-server.com/oauth/authorize',
  redirectUri: 'https://your-callback-url.com/callback',
  scopes: ['your_scope1', 'your_scope2'],
  audience: 'your_optional_audience', // If required
};

const oauth2Client = new OAuth2Client(oauth2Config);

const fetchAccessToken = async (): Promise<string> => {
  try {
    let token: OAuth2Token;

    if (grantType === GrantType.AUTH_CODE) {
      // Assuming you have the authorization code from the user's authorization
      const authCode = 'your_authorization_code_here';

      // Use the authorization_code grant to get the access token
      const grant = new OAuth2AuthorizationCodeGrant(oauth2Client, {
        code: authCode,
        redirect_uri: oauth2Config.redirectUri,
      });

      token = await grant.getToken();

    } else if (grantType === GrantType.CLIENT_CREDENTIALS) {
      // Use the client_credentials grant to get the access token
      const grant = new OAuth2ClientCredentialsGrant(oauth2Client, {
        scope: oauth2Config.scopes.join(' '),
      });
      token = await grant.getToken();

    } else {
      throw new Error('Unsupported grant type');
    }

    return token.access_token;

  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

const configuration = new Configuration({
  basePath: 'https://your-api-base-url.com',
  accessToken: fetchAccessToken,
});
