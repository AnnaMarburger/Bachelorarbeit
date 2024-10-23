import { Account } from "./account";
import { Preferences } from '@capacitor/preferences';

let account: Account | null;
let listeners: any[] = [];

const subscribeAccount = (listener: any) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
}

const emitChangeAccount = () => {
    for (let l of listeners) {
        l();
    }
}


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

    emitChangeAccount();
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
    emitChangeAccount();
    console.log("cleared account", account);
}

const acctoString = (): String => {
    return account ? account.print() : "null";
}

export { subscribeAccount, readActiveAccount, updateAccount, acctoString, clearAccount, readFromStorage };





