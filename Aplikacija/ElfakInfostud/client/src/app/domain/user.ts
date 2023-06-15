export interface User {
username: string;
token: string;
image: string;
role:string;
about:string;
}

export interface UserForm {
    username?: string;
    email: string;
    password: string;
}