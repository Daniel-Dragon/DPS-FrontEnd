import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Event, Job } from '../shared-module/models';

@Injectable()
export class MockBackend implements HttpInterceptor {
    users = JSON.parse(localStorage.getItem('users')) || defaultUsers;
    events: Event[] = JSON.parse(localStorage.getItem('events')) || defaultEvents;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // Mock LOG IN
        if (request.url == 'api/user/authenticate' && request.method == 'GET') {
            let email = request.headers.get('email');
            let password = request.headers.get('password');
            let foundUser = this.users.filter(user => {
                return user.user.email == email && user.user.password == password
            })[0];

            if (foundUser) {
                foundUser.authentication = foundUser.user.email;
                return new Observable(resp => {
                    resp.next(new HttpResponse({
                        status: 200,
                        body: foundUser
                    }));
                    resp.complete();
                });
            }

            return Observable.throw('Unauthorized Status: ' + status);
        }

        // Mock registering
        if (request.url == 'api/user/register' && request.method == 'PUT') {
            let userRegister = request.body;

            if (this.users.findIndex(user => user.email == userRegister.email) == -1) {
                // No user with email found, can register
                // Need to find next highest userId
                let nextId = 0;
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].user.id > nextId) {
                        nextId = this.users[i].user.id;
                    }
                }
                nextId += 1;
                userRegister.id = nextId;
                userRegister = {
                    user: userRegister,
                    permissions: {
                        admin: false,
                        employee: false,
                        volunteer: true,
                        developer: false
                    }
                };
                this.users.push(userRegister);
                localStorage.setItem('users', JSON.stringify(this.users));
                userRegister.authentication = userRegister.user.email;
                return new Observable(resp => {
                    resp.next(new HttpResponse({
                        status: 200,
                        body: userRegister
                    }));
                    resp.complete();
                })
            } else {
                // User found, error duplicate register
                return Observable.throw("User with email already registered");
            }
        }

        // Mock updating user details
        if (request.url == 'api/user' && request.method == 'PUT') {
            let updatedUser = request.body;
            let userToUpdateIndex = this.users.findIndex(user => user.user.id == updatedUser.id);
            // check if the user has permissions to edit this user by checking their token
            if (request.headers.get('authentication') == this.users[userToUpdateIndex].user.email) {
                //Has permission doing our stupid auth token as email thing
                updatedUser.password = this.users[userToUpdateIndex].user.password;
                this.users[userToUpdateIndex].user = updatedUser;
                localStorage.setItem('users', JSON.stringify(this.users));
                let response = {
                    user: updatedUser,
                    authentication: updatedUser.email,
                    permissions: this.users[userToUpdateIndex].permissions
                };
                return new Observable(resp => {
                    resp.next(new HttpResponse({
                        status: 200,
                        body: response
                    }));
                    resp.complete();
                })
            } else {
                //User doesn't have permission to update this user.
                return Observable.throw('Unauthorized to update this user');
            }

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

            let respBody = JSON.parse(JSON.stringify(matchingEvents[0]));

            // Remove identity info if not authorized
            if (!request.headers.get('authentication')) {
                for (let i = 0; i < respBody.jobs.length; i++) {
                    if (respBody.jobs[i].volunteer) {
                        respBody.jobs[i].volunteer = {
                            id: -1,
                            name: 'Volunteer'
                        };
                    }
                }
            }

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: respBody
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
            let userId = +JSON.parse(request.body).userId;

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

        // If we are adding a new job
        if(request.url.startsWith('api/events/job/') && request.method == 'PUT') {
            // api/events/job/:eventId header contains job
            let url = request.url.split('/');
            let eventId = +url[3];
            let job = <Job>JSON.parse(request.body);
            let nextJobId = 0;

            if (job.id != -1) {
                // We are updating a job
                let tempEventIndex = this.events.findIndex(event => event.id == eventId);
                let tempJobIndex = this.events[tempEventIndex].jobs.findIndex(curJob => curJob.id == job.id);
                job.volunteer = this.events[tempEventIndex].jobs[tempJobIndex].volunteer;
                this.events[tempEventIndex].jobs[tempJobIndex] = job;
            } else {
                // Find the highest jobId, then increase it by 1 so it's unique
                for (let i = 0; i < this.events.length; i++) {
                    for (let j = 0; j < this.events[i].jobs.length; j++) {
                        if (this.events[i].jobs[j].id > nextJobId) {
                            nextJobId = this.events[i].jobs[j].id;
                        }
                    }
                }
                nextJobId += 1;
                job.id = nextJobId;
                job.volunteer = null;
                this.events.filter(event => {
                    return event.id == eventId;
                })[0].jobs.push(job);
            }

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
            let userId = +JSON.parse(request.body).userId;

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

const defaultUsers = [
    {
        user: {
            id: 1,
            email: 'danfoote104227@gmail.com',
            password: 'password',
            name: 'Daniel Foote',
            phoneNumber: '5181234567'
        },
        permissions: {
            admin: true,
            employee: true,
            volunteer: true,
            developer: true
        }
    }
]

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