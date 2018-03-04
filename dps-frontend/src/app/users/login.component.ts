import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

import { UserService } from '../core-module/user.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    registerForm: FormGroup;
    isRegistering = false;

    // registerForm: FormGroup;

    constructor(public userService: UserService, public modalRef: BsModalRef, public router: Router) {}

    ngOnInit() {
        let email = new FormControl();
        let password = new FormControl();
        this.loginForm = new FormGroup({
            email: email,
            password: password
        });

        const emailReg = new FormControl('', [Validators.required, Validators.email]);
        const firstName = new FormControl('', [Validators.required]);
        const lastName = new FormControl('', [Validators.required]);
        const phoneNumber = new FormControl('', [Validators.required, Validators.minLength(10)]);
        const createPassword = new FormControl('', [Validators.required]);
        const verifyPassword = new FormControl('', [Validators.required]);
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

    register(registerForm): void {
        // TODO: need to check to make sure that: all fields have entries, email is not already registered, etc..
     console.log(registerForm.value);
     
        
    }

    close(): void {
        this.modalRef.hide();
    }
}
