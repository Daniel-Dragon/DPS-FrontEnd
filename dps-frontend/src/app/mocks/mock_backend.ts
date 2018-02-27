import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MockBackend implements HttpInterceptor {
    //TODO import .json file and use that for the default
    emails = JSON.parse(localStorage.getItem('emails')) || defaultEmail;
    passwords = JSON.parse(localStorage.getItem('passwords')) || defaultPasswords;
    events: Event = JSON.parse(localStorage.getItem('events')) || defaultEvents;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Mock LOG IN
        if (request.url == 'api/user/authenticate' && request.method == 'GET') {
            let status = 401;
            let body = {};
            let index = this.emails.findIndex((element) => {
                return element == request.headers.get('email');
            });

            if (index >= 0) {
                if (this.passwords[0] == request.headers.get('password')) {
                    status = 200;
                    body = {
                        authentication: 'validToken',
                        user: {
                            name: 'Test User',
                            email: 'danfoote104227@gmail.com',
                            phoneNumber: '5181234567'
                        }
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

        // Mock Events
        if (request.url == 'api/events' && request.method == 'GET') {
            let body = this.events;

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: body
                }));
                resp.complete();
            });
        }


        return next.handle(request);
    }
}

const defaultEmail = ['danfoote104227@gmail.com'];
const defaultPasswords = ['password'];

const defaultEvents = [
    {
        id: 0,
        name: 'Clean up Main Street',
        startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(8, 0, 0, 0),
        endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(10, 0, 0, 0),
        description: 'We will be leaving from the coffee shop to do a two hour pickup of litter around Main Street',
        volunteerGroups: [
            {
                title: 'General Volunteer',
                startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(8, 0, 0, 0),
                endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(10, 0, 0, 0),
                volunteers: [
                    {
                        name: 'Daniel Foote',
                        email: 'danfoote104227@gmail.com',
                        startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(8, 0, 0, 0),
                        endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(9, 0, 0, 0)
                    }
                ]
            }
        ]
    }
]