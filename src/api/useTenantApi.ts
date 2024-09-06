import {fetchApiWithTokenWrapper} from '../utils/auth/token.utils';
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
} from '../api/TenantAPIClient';
import {TenantDto} from "../api/GatewayAPIClient";

export const useTenantApi = (tenant?: TenantDto) => {

    const baseUrl =
        (import.meta.env.VITE_HSP_API_BASE_URL as string) +
        '/tenants/' +
        tenant ? tenant?.slug : (import.meta.env.VITE_HSP_TENANT_SLUG as string);

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
