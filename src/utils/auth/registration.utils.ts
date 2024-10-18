import { AccountLayer } from '../../modules/dalAccount';
import { useGatewayApi } from '../../api/useGatewayApi';
import { useTenantApi } from '../../api/useTenantApi';
import { CreateAnonymousUserCommand, UpdateCurrentUserCommand} from '../../api/GatewayAPIClient';
import { Account } from '../../modules/account';

export class RegistrationUtils {
  static async createAnonymousUser(account: Account) {
    if (!account.password) {
      throw new Error('Password is required');
    }
    const createAnonymousUserCommand = new CreateAnonymousUserCommand({
      password: account.password,
    });

    const userDto = await useGatewayApi().usersApi.createAnonymousUser(
      createAnonymousUserCommand,
    );
    account.userName = userDto.userName;
    await AccountLayer.update(account);

    if (account.name && account.name.length > 0) {
      await useGatewayApi().currentUserApi.updateCurrentUser(
        new UpdateCurrentUserCommand({
          givenName: account.name ?? undefined,
          familyName: account.familyName,
        }),
      );
    }
    return userDto;
  }

  static async registerInTenant() {
    await useTenantApi().participantsApi.participate();
  }

  static async registerInStudy() {
    const studyId = import.meta.env.VITE_HSP_STUDY_IDENTIFIER as string;
    await useTenantApi().studiesApi.participate(studyId);
  }
}
