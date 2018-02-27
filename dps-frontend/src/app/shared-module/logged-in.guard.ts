import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { UserService } from "../core-module/user.service";

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(public userService: UserService) {}

    canActivate() {
        return this.userService.isAuthorized();
    }
}