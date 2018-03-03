import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/Rx'
import { User } from "../shared-module/models";
import { AuthService } from "./auth.service";


@Injectable()
export class UserService implements OnInit {
    user: User;

    constructor(public http: HttpClient, private auth: AuthService) {}

    public login(loginForm) {
        return this.http.get('api/user/authenticate', {headers: new HttpHeaders(loginForm)}).do( 
            resp => {
            this.auth.authToken = (resp as any).authentication;
            this.auth.user = (resp as any).user; },
            err => {
                this.auth.authToken = null;
                localStorage.removeItem('authentication'); 
            }
        );
    }

    ngOnInit() {
    }
}