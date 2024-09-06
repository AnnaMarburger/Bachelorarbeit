

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

}

export class Account {

    token!: string;
    username: string | undefined;
    password: string | undefined;

    constructor(token: string, username: string | undefined, password: string | undefined){
        this.token = token;
        this.username = username;
        this.password = password;
    }


}

