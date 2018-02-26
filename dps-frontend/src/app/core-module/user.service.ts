import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/Rx'


@Injectable()
export class UserService implements OnInit {
    userName : string = "Test Username"
    authentication;

    constructor(public http: HttpClient) {}
    //TODO make observable that returns bool based on success.
    //Should send on HTTPS
    public login(loginForm) {
        return this.http.get('api/login', {headers: new HttpHeaders(loginForm)}).do( 
            resp => {
            this.authentication = (resp as any).authentication;
            localStorage.setItem('authentication', this.authentication); },
            err => {
                this.authentication = null;
                localStorage.removeItem('authentication'); 
            }
        );
    }

    ngOnInit() {
        this.authentication = localStorage.getItem('authentication');
    }
}