import { Injectable, OnInit } from "@angular/core";
import { User, Permissions } from "../shared-module/models";

@Injectable()
export class AuthService {
    authToken;
    user: User;
    permissions: Permissions;

    constructor() {
    }

    isAuthorized() {
        return !!this.authToken
    }

    getUserInfo() {
        return this.user;
    }

    getPermissions() {
        return this.permissions;
    }
}