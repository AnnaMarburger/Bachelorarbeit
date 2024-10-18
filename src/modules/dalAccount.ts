import { Account } from "./account";

export class AccountLayer {
    public static acc: Account;

    constructor(_acc: Account){
        AccountLayer.acc = _acc;
    }

    public static readActiveAccount(): Account {
        return this.acc;
    }

    public static update(_acc: Account) {
        //TODO check??
        this.acc = _acc;
    }

    toString(){
        return AccountLayer.acc.print();
    }

}



