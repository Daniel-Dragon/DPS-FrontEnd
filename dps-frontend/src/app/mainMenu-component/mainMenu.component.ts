import { Component } from "@angular/core";
import { UserService } from "../core-module/user-service/user.service";

@Component({
    selector: 'main-menu',
    templateUrl: './mainMenu.component.html'
})
export class MainMenuComponent {
    
    collapsed = true;
}