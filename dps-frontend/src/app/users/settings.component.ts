import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../core-module/auth.service";
import { UserService } from "../core-module/user.service";

@Component({
    templateUrl: './settings.component.html',
    styleUrls: []
    })
    export class SettingsComponent implements OnInit {
        constructor(public authService: AuthService, private userService: UserService) {}
        isEditing = false;
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
            userInfo.id = this.user.id;
            this.userService.updateUser(userInfo).subscribe(
                resp => {
                    this.isEditing = false;
                },
                err => {

                }
            )
        }
    }