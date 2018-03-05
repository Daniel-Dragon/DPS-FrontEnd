import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
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

    constructor(
        public userService: UserService, 
        public modalRef: BsModalRef, 
        public router: Router,
        private fb: FormBuilder
    ) {}

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
        this.registerForm = this.fb.group({
            email: ['', [Validators.email, Validators.required]],
            name: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required]],
            password: ['', [Validators.required]],
            passwordVerify: ['', [Validators.required]]
        })
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
        if (registerForm.password != registerForm.passwordVerify) {
            // TODO: Let user know they aren't equal? Or maybe display in form and not allow submission instead.
        } else {
            delete registerForm.passwordVerify;
            this.userService.register(registerForm).subscribe(
                resp => {
                    this.modalRef.hide();
                },
                err => {

                }
            );
        }
        console.log(registerForm.value);
     
        
    }

    close(): void {
        this.modalRef.hide();
    }
}
