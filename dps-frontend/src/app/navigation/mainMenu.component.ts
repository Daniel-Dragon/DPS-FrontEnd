import { Component } from '@angular/core';
import { UserService } from '../core-module/user.service';
import { LoginComponent } from '../users/login.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-main-menu',
    templateUrl: './mainMenu.component.html',
    styleUrls: ['./mainMenu.component.css']
    })
export class MainMenuComponent {

    collapsed: Boolean = true;

    constructor(private modalService: BsModalService) {}

    testModal() {
        this.modalService.show(LoginComponent);
    }
}
