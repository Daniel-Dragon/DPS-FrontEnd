import { Observable } from 'rxjs/observable'
import { UserService } from './user.service';
// import { HttpClient } from "@angular/common/http";

describe('UserService', () => {
    let mockHttp = {
        get: jasmine.createSpy().and.callFake(() => {
            return { do: () => {}}
        })
    };
    let service;

    beforeEach(() => {
        service = new UserService(<any>mockHttp);
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