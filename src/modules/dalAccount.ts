

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

export class Account {
    id!: string;
    token!: string;
    username: string | undefined;
    password: string | undefined;

    constructor(id: string, token: string, username: string | undefined, password: string | undefined){
        this.id = id;
        this.token = token;
        this.username = username;
        this.password = password;
    }

    public print(){
        return "{id: " + this.id + ", token: " + this.token + ", username: " + this.username + "}";
    }

}

