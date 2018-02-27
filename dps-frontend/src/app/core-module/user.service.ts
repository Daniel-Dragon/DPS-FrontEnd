import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/Rx'
import { User } from "../shared-module/models";


@Injectable()
export class UserService implements OnInit {
    user: User;
    authentication;

    constructor(public http: HttpClient) {}
    
    public isAuthorized(): boolean {
        return !!this.authentication;
    }

    public login(loginForm) {
        return this.http.get('api/user/authenticate', {headers: new HttpHeaders(loginForm)}).do( 
            resp => {
            this.authentication = (resp as any).authentication;
            this.user = (resp as any).user;
            localStorage.setItem('authentication', this.authentication); },
            err => {
                this.authentication = null;
                localStorage.removeItem('authentication'); 
            }
        );
    }

    public getUserInfo() {
        if (!this.authentication)
            return
        return this.user;
    }

    ngOnInit() {
        this.authentication = localStorage.getItem('authentication');
    }
}