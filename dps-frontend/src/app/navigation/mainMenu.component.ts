import { Component } from '@angular/core';
import { UserService } from '../core-module/user.service';
import { LoginComponent } from '../users/login.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-menu',
    templateUrl: './mainMenu.component.html',
    styleUrls: ['./mainMenu.component.css']
    })
export class MainMenuComponent {

    collapsed: Boolean = true;

    constructor(private modalService: BsModalService, public userService: UserService, public router: Router) {}

    login() {
        this.modalService.show(LoginComponent);
    }

    settings() {
    }
}
