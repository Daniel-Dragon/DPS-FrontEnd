import { Injectable, OnInit } from '@angular/core';
import { User, Permissions } from '../shared-module/models';

@Injectable()
export class AuthService {
    authToken;
    user: User;
    permissions: Permissions;

    constructor() {
    }

    isAuthorized() {
        return !!this.authToken;
    }

    getUserInfo() {
        return this.user;
    }

    getPermissions() {
        return this.permissions;
    }

    logout() {
        // TODO: Do we need to make a service call to have token destroyed on server?
        this.authToken = null;
        this.user = null;
        this.permissions = null;
        localStorage.removeItem('token');
    }
}
