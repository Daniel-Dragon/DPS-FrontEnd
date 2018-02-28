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
    registerForm: FormGroup;
    isRegistering: boolean = false;
    // registerForm: FormGroup;

    constructor(public userService: UserService, public modalRef: BsModalRef, public router: Router) {}

    ngOnInit() {
        let email = new FormControl();
        let password = new FormControl();
        this.loginForm = new FormGroup({
            email: email,
            password: password
        });

        let emailReg = new FormControl();
        let firstName = new FormControl();
        let lastName = new FormControl();
        let phoneNumber = new FormControl();
        let createPassword = new FormControl();
        let verifyPassword = new FormControl();
        this.registerForm = new FormGroup({
            emailReg: emailReg,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            createPassword: createPassword,
            verifyPassword: verifyPassword
        });
    }

    login(loginForm): void {
        this.userService.login(loginForm).subscribe( (resp) => {
            console.log('Success');
            this.close();
        },
        (err) => {
            console.log('Failure');
        });
    }

    close(): void {
        this.modalRef.hide();
    }
}
