// class to safe user specific account data like password and username which are used to log in to the server
export class Account {
    id: string | undefined;
    token: string | undefined;
    password!: string;
    userName: string | undefined;
    familyName: string | undefined;
    name: string | undefined;

    constructor(id: string | undefined, token: string | undefined, userName: string | undefined, password: string, familyName: string | undefined, name: string | undefined){
        this.id = id;
        this.token = token;
        this.userName = userName;
        this.password = password;
        this.familyName = familyName;
        this.name = name;
    }

    public print(){
        return "{id: " + this.id + ", token: " + this.token + ", username: " + this.userName + "}";
    }

}