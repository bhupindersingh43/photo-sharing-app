export interface User {
    fullName: string;
    email: string; 
    password: string;
    token:string;
}

export interface UserInfo {
    fullName: string;
    email: string; 
}

export interface Login {
    email: string; 
    password: string;
}