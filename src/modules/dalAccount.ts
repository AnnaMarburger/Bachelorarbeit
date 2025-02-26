import { Account } from "./account";
import { Preferences } from '@capacitor/preferences';

// local account instance to temporally save user specific data
let account: Account | null;

const readActiveAccount = (): Account | null => {
    return account;
}

const updateAccount = async (_acc: Account): Promise<Account> => {
    account = _acc;
    await Preferences.set({
        key: 'activeAccount',
        value: JSON.stringify(_acc),
    });

    return account;
}

const readFromStorage = async (): Promise<Account | null> => {
    const { value } = await Preferences.get({ key: 'activeAccount' });
    if (value) {
        account = JSON.parse(value);
        return account;
    }
    return null;
};

const clearAccount = async () => {
    account = null;
    await Preferences.remove({ key: 'activeAccount' });
}

const acctoString = (): String => {
    return account ? account.print() : "null";
}

export {readActiveAccount, updateAccount, acctoString, clearAccount, readFromStorage };





