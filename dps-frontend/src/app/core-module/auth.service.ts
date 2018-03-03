import { Injectable, OnInit } from "@angular/core";
import { User } from "../shared-module/models";

@Injectable()
export class AuthService {
    authToken;
    user: User;

    constructor() {
    }

    isAuthorized() {
        return !!this.authToken
    }

    getUserInfo() {
        return this.user;
    }
}