import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserService } from "../core-module/user.service";

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(public userService: UserService, public router: Router) {}

    canActivate() {
        if (this.userService.isAuthorized())
            return true
        else {
            this.router.navigate(['']);
            return false;
        }
    }
}