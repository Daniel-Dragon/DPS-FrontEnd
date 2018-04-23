import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core-module/auth.service';
import { UserService } from '../core-module/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GuardModalComponent } from '../guardmodal';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: []
    })
export class SettingsComponent implements OnInit {
    constructor(public authService: AuthService, private modalService: BsModalService, private userService: UserService) {}
    isEditing = false;
    userForm;
    name;
    email;
    modalRef: BsModalRef;
    phoneNumber;
    user;
    ngOnInit() {
        this.userService.onAuthChange.subscribe(resp => { this.user = this.authService.getUserInfo(); });
        this.user = this.authService.getUserInfo();
        this.name = new FormControl(this.user.name, Validators.required);
        this.email = new FormControl(this.user.email, [Validators.required, Validators.email]);
        this.phoneNumber = new FormControl(this.user.phoneNumber, Validators.required);
        this.userForm = new FormGroup({
            name: this.name,
            email: this.email,
            phoneNumber: this.phoneNumber
        });
    }

    public DisableSave() {
        return this.userForm.pristine || !this.userForm.valid;
    }

    public SaveUserInfo(userInfo) {
        userInfo.ID = this.user.ID;
        this.userService.updateUser(userInfo).subscribe(
            resp => {
                this.isEditing = false;
            },
            err => {

            }
        );
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
      }

    canDeactivate() {
        if (this.isEditing && this.userForm.dirty) {
            const subject = new Subject<Boolean>();
            const modal = this.modalService.show(GuardModalComponent);
            modal.content.subject = subject;

            return subject.asObservable();
        } else {
            return true;
        }
    }
}
