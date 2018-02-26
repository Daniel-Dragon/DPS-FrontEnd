import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MockBackend implements HttpInterceptor {
    //TODO import .json file and use that for the default
    emails = JSON.parse(localStorage.getItem('emails')) || defaultEmail;
    passwords = JSON.parse(localStorage.getItem('passwords')) || defaultPasswords;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Mock LOG IN
        if (request.url == 'api/login' && request.method == 'GET') {
            let status = 401;
            let body = {};
            let index = this.emails.findIndex((element) => {
                return element == request.headers.get('email');
            });

            if (index >= 0) {
                if (this.passwords[0] == request.headers.get('password')) {
                    status = 200;
                    body = {
                        authentication: 'validToken'
                    };
                }
            }
            if (status == 200)
                return new Observable(resp => {
                    resp.next(new HttpResponse({
                        status: status,
                        body: body
                    }));
                    resp.complete();
                });
            else
                return Observable.throw('Unauthorized Status: ' + status);
        }
        return next.handle(request);
    }
}

const defaultEmail = ['danfoote104227@gmail.com'];
const defaultPasswords = ['password'];