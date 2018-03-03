import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../core-module/auth.service";

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(public authService: AuthService, public router: Router) {}

    canActivate() {
        if (this.authService.isAuthorized())
            return true
        else {
            this.router.navigate(['']);
            return false;
        }
    }
}