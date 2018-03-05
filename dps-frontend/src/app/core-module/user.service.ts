import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/Rx'
import { User } from "../shared-module/models";
import { AuthService } from "./auth.service";
import { Subject } from "rxjs/Rx";


@Injectable()
export class UserService implements OnInit {
    user: User;
    onAuthChange = new Subject();

    constructor(public http: HttpClient, private auth: AuthService) {}

    public login(loginForm) {
        let header = {
            headers: new HttpHeaders(loginForm)
        };
        return this.http.get('api/user/authenticate', {headers: new HttpHeaders(loginForm)}).do( 
            resp => {
                this.auth.authToken = (resp as any).authentication;
                this.auth.user = (resp as any).user;
                this.auth.permissions = (resp as any).permissions;
                this.onAuthChange.next(true);
            },
            err => {
                this.auth.authToken = null;
                this.onAuthChange.next(true);
                localStorage.removeItem('authentication'); 
            }
        );
    }

    public register(registerForm) {
        return this.http.put('api/user/register', registerForm).do(
            resp => {
                this.auth.authToken = (resp as any).authentication;
                this.auth.permissions = (resp as any).permissions;
                delete (resp as any).authentication;
                delete (resp as any).permissions;
                this.auth.user = (resp as any);
                this.onAuthChange.next(true);
            },
            err => {

            }
        )
    }

    ngOnInit() {
    }
}