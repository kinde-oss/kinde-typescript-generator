import { OAuth2Client, OAuth2Token, generateCodeVerifier } from "@badgateway/oauth2-client";
import { Configuration } from "./index"; 
import * as crypto from 'crypto';

function generateRandomString(length: number): string {
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  const randomHexString = randomBytes.toString('hex');
  return randomHexString.slice(0, length);
}

export class KindeAuthClient {
  private oauth2Client: OAuth2Client;
  private state: string;
  private codeVerifier: string;
  private redirectUri: string;
  private scopes: string[];
  private tokens: OAuth2Token;

  constructor(
    kindeDomain: string,
    clientId: string,
    redirectUri: string,
    scopes: string[] = ["openid", "profile", "email", "offline"],
    audience?: string,
  ) {
    // OAuth2 configuration
    const oauth2Config = {
      server: kindeDomain,
      clientId: clientId,
      tokenEndpoint: `${kindeDomain}/oauth2/token`,
      authorizationEndpoint: `${kindeDomain}/oauth2/auth`,
      redirectUri: redirectUri,
      scopes: scopes,
      audience:audience,
    };

    this.oauth2Client = new OAuth2Client(oauth2Config);
    this.state = generateRandomString(32);
    this.redirectUri = redirectUri;
    this.scopes = scopes;
  }

  public async login(): Promise<string> {
    this.codeVerifier = await generateCodeVerifier();
    const authUrl = await this.oauth2Client.authorizationCode.getAuthorizeUri({
      redirectUri: this.redirectUri,
      state: this.state,
      codeVerifier: this.codeVerifier,
      scope: this.scopes,
    });

    return authUrl;
  }

  public async handleLoginCallback(callbackUrl: string) {
    console.log( "Log in callback handled!");
    this.tokens = await this.oauth2Client.authorizationCode.getTokenFromCodeRedirect(
      callbackUrl,
      {
        redirectUri: this.redirectUri,
        state: this.state,
        codeVerifier: this.codeVerifier,
      }
    );
  }

  public async getAccessToken(): Promise<string> {
    return this.tokens.accessToken;
  }
}

export class KindeMgmtApiClient  {
  private oauth2Client: OAuth2Client;
  private tokens: OAuth2Token;

  constructor(
    kindeDomain: string,
    clientId: string,
    clientSecret: string,
    audience?: string,
  ) {

    const oauth2Config = {
      server: kindeDomain,
      clientId: clientId,
      clientSecret: clientSecret,
      tokenEndpoint: `${kindeDomain}/oauth2/token`,
      audience:audience,
    };

    this.oauth2Client = new OAuth2Client(oauth2Config);
  }

  public async login() {
    this.tokens = await this.oauth2Client.clientCredentials();
  }

  public async getAccessToken(): Promise<string> {
    return this.tokens.accessToken;
  }
};
