import { Observable } from 'rxjs/Observable'
import { UserService } from './user.service';
// import { HttpClient } from "@angular/common/http";

describe('UserService', () => {
    let mockHttp = {
        get: jasmine.createSpy().and.callFake(() => {
            return { do: () => {}}
        })
    };
    let mockAuth = {

    };
    let service;

    beforeEach(() => {
        service = new UserService(<any>mockHttp, <any>mockAuth);
    });

    it('login should make the correct http call', () => {
        let user = {
            email: 'test@email.com',
            password: 'password'
        };
        service.login(user);
        expect(mockHttp.get).toHaveBeenCalledWith('api/user/authenticate', jasmine.any(Object));
    })
})