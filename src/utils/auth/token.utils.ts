import { Auth } from '../../services/AuthService';
import { AccountLayer } from '../../modules/dalAccount';
import jwt from 'jsonwebtoken';

interface ClientCredentialsTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp ? decodedToken.exp > currentTime : false;
  } catch (error) {
    console.error('Error decoding token: ', error);
    return false;
  }
};

const getClientCredentialsToken = async (
  clientId: string,
  clientSecret: string,
  tokenUrl: string,
  grantType: string,
): Promise<ClientCredentialsTokenResponse> => {
  const params = new URLSearchParams({
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to obtain access token: ${response.statusText}`);
  }

  return await response.json();
};

const getResourceOwnerPasswordFlowToken = async (
  username: string,
  password: string,
  tokenUrl: string,
): Promise<ClientCredentialsTokenResponse> => {
  const params = new URLSearchParams({
    grant_type: import.meta.env
      .VITE_HSP_OIDC_RESOURCE_OWNER_GRANT_TYPE as string,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID as string,
    username,
    password,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to obtain access token: ${response.statusText}`);
  }

  return await response.json();
};

const fetchApiWithToken = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
) => {
  try {
    const account = await AccountLayer.readActiveAccount();
    let token = account.token;

    if (!token || !isTokenValid(token)) {
      if (account && account.username && account.password) {
        const clientCredentialsToken = await getResourceOwnerPasswordFlowToken(
          account.username,
          account.password,
          import.meta.env.VITE_HSP_OIDC_TOKEN_URL as string,
        );
        token = clientCredentialsToken.access_token;
      } else {
        const authToken = await Auth.Instance.getValidToken();
        token = authToken.accessToken;
      }
      account.token = token;
      await AccountLayer.update(account);
    }

    if (token) {
      init.headers = {
        ...init.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  } catch (error) {
    console.error('Error fetching token: ', error);
  }

  return fetch(input, init);
};

const fetchApiWithTokenWrapper = {
  fetch: fetchApiWithToken,
};

const fetchApiClientCredentials = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
) => {
  try {
    const token = await getClientCredentialsToken(
      import.meta.env.VITE_HSP_OIDC_CLIENT_CREDENTIALS_CLIENT_ID as string,
      import.meta.env.VITE_HSP_OIDC_CLIENT_CREDENTIALS_CLIENT_SECRET as string,
      import.meta.env.VITE_HSP_OIDC_TOKEN_URL as string,
      import.meta.env.VITE_HSP_OIDC_CLIENT_CREDENTIALS_GRANT_TYPE as string,
    );

    if (token) {
      init.headers = {
        ...init.headers,
        Authorization: `Bearer ${token.access_token}`,
      };
    }
  } catch (error) {
    console.error('Error fetching token: ', error);
  }

  return fetch(input, init);
};

const fetchApiClientCredentialsWrapper = {
  fetch: fetchApiClientCredentials,
};

export {
  getClientCredentialsToken,
  getResourceOwnerPasswordFlowToken,
  fetchApiWithToken,
  fetchApiWithTokenWrapper,
  fetchApiClientCredentials,
  fetchApiClientCredentialsWrapper,
};
