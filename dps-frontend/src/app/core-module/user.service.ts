import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/Rx'
import { User } from "../shared-module/models";
import { AuthService } from "./auth.service";
import { Subject } from "rxjs/Rx";
import { ToastrService } from "ngx-toastr";


@Injectable()
export class UserService implements OnInit {
    user: User;
    onAuthChange = new Subject();

    constructor(public http: HttpClient, 
                private auth: AuthService,
                private toastr: ToastrService) {}

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
                this.auth.logout();
                this.onAuthChange.next(true);
            }
        );
    }

    public register(registerForm) {
        return this.http.put('api/user/register', registerForm).do(
            resp => {
                this.auth.authToken = (resp as any).authentication;
                this.auth.permissions = (resp as any).permissions;
                this.auth.user = (resp as any).user;
                this.onAuthChange.next(true);
            },
            err => {
                this.toastr.error('There is something wrong and you were not registered. Please try again.', 'Error');
            }
        )
    }

    public updateUser(user: User) {
        return this.http.put('api/user', user).do(
            resp => {
                this.auth.authToken = (resp as any).authentication;
                this.auth.permissions = (resp as any).permissions;
                this.auth.user = (resp as any).user;
                this.toastr.success('User settings have been saved.', 'Success!');
                this.onAuthChange.next(true);
            },
            err => {
                this.auth.logout();
                this.toastr.error('Something went wrong and your settings weren\'t saved', 'Error');
                this.onAuthChange.next(true);
            }
        );
    }

    ngOnInit() {
    }
}