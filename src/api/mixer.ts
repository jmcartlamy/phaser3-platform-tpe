import { JSO } from 'jso';

class Mixer {
  private OAuthClient: any;
  private accessToken: string | undefined;
  private refreshToken: string | undefined;

  constructor() {
    this.OAuthClient = new JSO({
      providerID: 'mixer',
      redirect_uri: 'http://localhost:8080/',
      response_type: 'code',
      authorization: process.env.API_URI_AUTHORIZATION,
      token: process.env.API_URI_TOKEN,
      client_id: process.env.API_CLIENT_ID,
      scopes: {
        request: ['interactive:robot:self']
      },
      client_secret: process.env.API_CLIENT_SECRET
    });
  }

  public async getToken(): Promise<string> {
    let token = null;
    let callback;

    try {
      callback = await this.OAuthClient.callback();
    } catch (e) {
      console.log(e);
      return;
    }

    if (callback) {
      token = callback;
    } else {
      token = await this.OAuthClient.getToken();
    }

    this.accessToken = token.access_token;
    this.refreshToken = token.refresh_token;

    return this.accessToken;
  }

  public getCurrentToken(): string {
    return this.accessToken;
  }
}

export default Mixer;
