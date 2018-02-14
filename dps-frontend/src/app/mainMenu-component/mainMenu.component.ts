import { Component } from '@angular/core';
import { UserService } from '../core-module/user-service/user.service';
import { ModalService } from '../shared-module/modal.service/modal.service';
import { LoginComponent } from '../login.component/login.component';

@Component({
    selector: 'app-main-menu',
    templateUrl: './mainMenu.component.html',
    styleUrls: ['./mainMenu.component.css']
    })
export class MainMenuComponent {

    collapsed: Boolean = true;

    constructor(private modalService: ModalService) {}

    testModal() {
        this.modalService.makeModal(LoginComponent as Component);
    }
}
