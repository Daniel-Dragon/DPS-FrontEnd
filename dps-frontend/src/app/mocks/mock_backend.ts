import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Event } from '../shared-module/models';

@Injectable()
export class MockBackend implements HttpInterceptor {
    //TODO import .json file and use that for the default
    emails = JSON.parse(localStorage.getItem('emails')) || defaultEmail;
    passwords = JSON.parse(localStorage.getItem('passwords')) || defaultPasswords;
    events: Event[] = JSON.parse(localStorage.getItem('events')) || defaultEvents;

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
                            id: 0,
                            name: 'Daniel Foote',
                            email: 'danfoote104227@gmail.com',
                            phoneNumber: '5181234567'
                        }
                    };
                }
            }
            if (status == 200) {
                return new Observable(resp => {
                    resp.next(new HttpResponse({
                        status: status,
                        body: body
                    }));
                    resp.complete();
                });
            }
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

        // Mock Single Event
        if (request.url.startsWith('api/events/') && request.method == 'GET') {
            // Get the ID number
            let url = request.url.split('/');
            let id = +url[url.length - 1];

            let matchingEvents = this.events.filter(event => {
                return event.id == id;
            });

            let body = JSON.parse(JSON.stringify(matchingEvents[0]));

            // Remove identity info if not authorized
            if (!request.headers.get('authentication')) {
                for (let i = 0; i < body.jobs.length; i++) {
                    if (body.jobs[i].volunteer) {
                        body.jobs[i].volunteer = {
                            id: -1,
                            name: 'Volunteer'
                        };
                    }
                }
            }

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: body
                }));
                resp.complete();
            })
        }

        // If we are unregistering
        if(request.url.startsWith('api/events/unregister') && request.method == 'PUT') {
            // api/events/unregister/:eventId/:jobId header contains userId
            let url = request.url.split('/');
            let eventId = +url[3];
            let jobId = +url[4];
            let userId = +request.params.get('userId');

            this.events.filter(event => {
                return event.id == eventId;
            })[0].jobs.filter(job=> {
                return job.id == jobId;
            })[0].volunteer = null;

            localStorage.setItem('events', JSON.stringify(this.events));

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: {}
                }));
                resp.complete();
            })
        }

        // If we are volunteering for a job
        if(request.url.startsWith('api/events/') && request.method == 'PUT') {
            // api/events/:eventId/:jobId header contains userId
            let url = request.url.split('/');
            let eventId = +url[2];
            let jobId = +url[3];
            let userId = +request.params.get('userId');

            this.events.filter(event => {
                return event.id == eventId;
            })[0].jobs.filter(job=> {
                return job.id == jobId;
            })[0].volunteer = {
                id:userId,
                name:"Daniel Foote",
                email:"danfoote104227@gmail.com"
            };

            localStorage.setItem('events', JSON.stringify(this.events));

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: {}
                }));
                resp.complete();
            })
        }


        return next.handle(request);
    }
}

const defaultEmail = ['email@gmail.com'];
const defaultPasswords = ['password'];

const defaultEvents = [
    {
        id: 0,
        name: 'Clean up Main Street',
        startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(8, 0, 0, 0),
        endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(10, 0, 0, 0),
        description: 'We will be leaving from the coffee shop to do a two hour pickup of litter around Main Street',
        jobs: [
            {
                id: 0,
                name: 'General Volunteer',
                startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(8, 0, 0, 0),
                endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(10, 0, 0, 0),
                volunteer: {
                        id: 0,
                        name: 'Daniel Foote',
                        email: 'danfoote104227@gmail.com'
                }
            },
            {
                id: 1,
                name: 'Bagger',
                startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(8, 0, 0, 0),
                endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(10, 0, 0, 0),
                volunteer: {
                    id: 1,
                    name: 'Barry BlueJeans',
                    email: 'bJean@gmail.com',
                }
            },
            {
                id: 2,
                name: 'Overseer',
                startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(8, 0, 0, 0),
                endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(10, 0, 0, 0),
                volunteer: null
            }
        ]
    },
    {
        id: 1,
        name: 'Code Blue Shelter',
        startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(18, 0, 0, 0),
        endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(24, 0, 0, 0),
        description: 'It will be below freezing this night, we will be opening the shelter for those who need it and need volunteers to organize this event.',
        jobs: [
            {
                id: 3,
                name: 'Cook',
                startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(18, 0, 0, 0),
                endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(24, 0, 0, 0),
                volunteer: {
                        id: 0,
                        name: 'Daniel Foote',
                        email: 'danfoote104227@gmail.com'
                }
            },
            {
                id: 4,
                name: 'Stocker',
                startTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(18, 0, 0, 0),
                endTime: new Date(Date.now() + (1000 * 60 * 60 * 24 * 10)).setHours(24, 0, 0, 0),
                volunteer: {
                    id: 1,
                    name: 'Billy BlueJeans',
                    email: 'bJean@gmail.com',
                }
            }
        ]
    }
]