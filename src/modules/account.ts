export class Account {
    id!: string;
    token!: string;
    password!: string;
    userName: string | undefined;
    familyName: string | undefined;
    name: string | undefined;

    constructor(id: string, token: string, userName: string | undefined, password: string, familyName: string | undefined, name: string | undefined){
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