import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

import { UserService } from '../core-module/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'modal-content',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    // registerForm: FormGroup;

    constructor(public userService: UserService, public modalRef: BsModalRef, public router: Router) {}

    ngOnInit() {
        let email = new FormControl();
        let password = new FormControl();
        this.loginForm = new FormGroup({
            email: email,
            password: password
        });
    }

    login(loginForm): void {
        this.userService.login(loginForm).subscribe( (resp) => {
            console.log('Success');
        },
        (err) => {
            console.log('Failure');
        });
    }

    close(): void {
        this.modalRef.hide();
    }
}
