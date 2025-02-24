import {updateAccount } from './dalAccount';
import { getResourceOwnerPasswordFlowToken } from '../utils/auth/token.utils';
import { Account } from './account';

// send user login data to server and get token for further server requests
// returns true if succesful and false otherwise
const loginUser = async (_username: string, _password: string) => {
    try {
        // retrieve token from server
        const tokenResponse = await getResourceOwnerPasswordFlowToken(
            _username,
            _password,
            import.meta.env.VITE_HSP_OIDC_TOKEN_URL as string
        );

        // save token to local account instance for further requests
        const userAcc = new Account(undefined, tokenResponse.access_token, _username, _password, undefined, undefined);
        await updateAccount(userAcc);
        return true;
    } catch (error) {
        return false;
    }
};

export {loginUser};


