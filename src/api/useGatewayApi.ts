import {
  fetchApiClientCredentialsWrapper,
  fetchApiWithTokenWrapper,
} from '../utils/auth/token.utils';
import {
  CurrentUserClient,
  StudiesClient,
  TenantsClient,
  UsersClient,
} from '../api/GatewayAPIClient';

export const useGatewayApi = () => {
  const baseUrl = import.meta.env.VITE_HSP_API_BASE_URL as string;

  if (!baseUrl) {
    throw new Error(
      'API base URL is not defined in the environment variables.',
    );
  }

  return {
    currentUserApi: new CurrentUserClient(baseUrl, fetchApiWithTokenWrapper),
    studiesApi: new StudiesClient(baseUrl, fetchApiWithTokenWrapper),
    tenantsApi: new TenantsClient(baseUrl, fetchApiWithTokenWrapper),
    usersApi: new UsersClient(baseUrl, fetchApiClientCredentialsWrapper),
  };
};
