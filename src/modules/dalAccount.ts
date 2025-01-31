import { Account } from "./account";
import { Preferences } from '@capacitor/preferences';

let account: Account | null;

// return current account object
const readActiveAccount = (): Account | null => {
    return account;
}

// update account, emit changes
const updateAccount = async (_acc: Account): Promise<Account> => {
    account = _acc;
    await Preferences.set({
        key: 'activeAccount',
        value: JSON.stringify(_acc),
    });

    return account;
}

//read account from storage
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
    console.log("cleared account", account);
}

const acctoString = (): String => {
    return account ? account.print() : "null";
}

export {readActiveAccount, updateAccount, acctoString, clearAccount, readFromStorage };





