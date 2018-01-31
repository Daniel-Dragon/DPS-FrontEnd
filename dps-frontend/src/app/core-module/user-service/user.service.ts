import { Injectable } from "@angular/core";

@Injectable()
export class UserService {
    userName : string = "Test Username"

    //TODO make observable that returns bool based on success.
    //Should send on HTTPS
    login(userName: string, password: string): void {
        
    }
}