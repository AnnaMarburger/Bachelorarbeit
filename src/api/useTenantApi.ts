import { fetchApiWithTokenWrapper } from '../utils/auth/token.utils';
import {
  AppPagesClient,
  AppsClient,
  ContextObjectsClient,
  CurrentUserClient,
  DevicesClient,
  FilesClient,
  LanguagesClient,
  ParticipantsClient,
  QuestionnairesClient,
  SearchClient,
  StudiesClient,
} from './TenantAPIClient';
import { TenantDto } from './GatewayAPIClient';

export const useTenantApi = (tenant?: TenantDto) => {
  const baseUrl =
    tenant?.apiUrl ?? import.meta.env.VITE_HSP_TENANT_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      'API base URL is not defined in the environment variables.',
    );
  }

  return {
    appPagesApi: new AppPagesClient(baseUrl, fetchApiWithTokenWrapper),
    appsApi: new AppsClient(baseUrl, fetchApiWithTokenWrapper),
    contextObjectsApi: new ContextObjectsClient(
      baseUrl,
      fetchApiWithTokenWrapper,
    ),
    currentUserApi: new CurrentUserClient(baseUrl, fetchApiWithTokenWrapper),
    devicesApi: new DevicesClient(baseUrl, fetchApiWithTokenWrapper),
    filesApi: new FilesClient(baseUrl, fetchApiWithTokenWrapper),
    languagesApi: new LanguagesClient(baseUrl, fetchApiWithTokenWrapper),
    participantsApi: new ParticipantsClient(baseUrl, fetchApiWithTokenWrapper),
    questionnairesApi: new QuestionnairesClient(
      baseUrl,
      fetchApiWithTokenWrapper,
    ),
    searchApi: new SearchClient(baseUrl, fetchApiWithTokenWrapper),
    studiesApi: new StudiesClient(baseUrl, fetchApiWithTokenWrapper),
  };
};
