import { Component } from '@angular/core';
import { LoginComponent } from '../users/login.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AuthService } from '../core-module/auth.service';
import { MessageService } from '../message/message.service';

@Component({
    selector: 'app-main-menu',
    templateUrl: './mainMenu.component.html',
    styleUrls: ['./mainMenu.component.css']
    })
export class MainMenuComponent {

    collapsed: Boolean = true;

    constructor(private modalService: BsModalService,
                public authService: AuthService,
                public router: Router,
                private messageService: MessageService) {}

    login() {
        this.modalService.show(LoginComponent);
    }

    settings() {
    }
}
