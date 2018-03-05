import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../core-module/auth.service";

@Component({
    templateUrl: './settings.component.html',
    styleUrls: []
    })
    export class SettingsComponent implements OnInit {
        constructor(public authService: AuthService) {}
        userForm;
        name;
        email;
        phoneNumber;
        user;
        ngOnInit() {
            this.user = this.authService.getUserInfo()
            this.name = new FormControl(this.user.name, Validators.required);
            this.email = new FormControl(this.user.email, [Validators.required, Validators.email]);
            this.phoneNumber = new FormControl(this.user.phoneNumber, Validators.required);
            this.userForm = new FormGroup({
                name: this.name,
                email: this.email,
                phoneNumber: this.phoneNumber
            })
        }

        public DisableSave() {
            return this.userForm.pristine || !this.userForm.valid
        }

        public SaveUserInfo(userInfo) {
            //TODO gotta have this call UserService and update user info... do I need a userID or do I need to just use the token?
        }
    }