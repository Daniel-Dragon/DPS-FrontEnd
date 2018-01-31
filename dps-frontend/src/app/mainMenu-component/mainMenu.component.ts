import { Component } from '@angular/core';
import { UserService } from '../core-module/user-service/user.service';

@Component({
    selector: 'app-main-menu',
    templateUrl: './mainMenu.component.html',
    styleUrls: ['./mainMenu.component.css']
    })
export class MainMenuComponent {

    collapsed = true;
}
