import {updateAccount } from './dalAccount';
import { getResourceOwnerPasswordFlowToken } from '../utils/auth/token.utils';
import { Account } from './account';

const loginUser = async (_username: string, _password: string) => {
    try {
        // Token abrufen
        const tokenResponse = await getResourceOwnerPasswordFlowToken(
            _username,
            _password,
            import.meta.env.VITE_HSP_OIDC_TOKEN_URL as string
        );

        // Zugriffstoken für weitere Anfragen speichern
        const userAcc = new Account(undefined, tokenResponse.access_token, _username, _password, undefined, undefined);
        await updateAccount(userAcc);
        return true;
    } catch (error) {
        return false;
    }
};

export {loginUser};


