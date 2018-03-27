import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

describe('UserService', () => {
    const mockHttp = {
        get: jasmine.createSpy().and.callFake(() => {
            return {
                do: () => {},
                map: () => {}
            };
        })
    };
    const mockAuth = {

    };
    const mockToastr = {
        error: jasmine.createSpy().and.callFake((message, title) => {
            return;
        }),
        success: jasmine.createSpy().and.callFake((message, title) => {
            return;
        })
    };
    let service;

    beforeEach(() => {
        service = new UserService(<any>mockHttp, <any>mockAuth, <any>mockToastr);
    });

    it('login should make the correct http call', () => {
        const user = {
            email: 'test@email.com',
            password: 'password'
        };
        service.login(user);
        expect(mockHttp.get).toHaveBeenCalledWith('api/user/authenticate', jasmine.any(Object));
    });
});
