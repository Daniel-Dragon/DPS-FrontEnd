import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Event, Job, Message } from '../shared-module/models';

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

            if (this.users.findIndex(user => user.user.email == userRegister.email) == -1) {
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

        // Mock adding/updating Event
        if (request.url == 'api/events' && request.method == 'PUT') {
            let event = request.body;
            let auth = request.headers.get('authentication');

            // Find user who made request and see if they're authorized
            let requester = this.users.filter(user => user.user.email == auth)[0];

            if (!requester || !requester.permissions.admin) {
                return Observable.throw('You are not authorized to change Events.');
            }

            // If id == -1 it's a new event
            if (event.id == -1) {
                let newId = 0;
                for (let i = 0; i < this.events.length; i++) {
                    if (this.events[i].id > newId) {
                        newId = this.events[i].id;
                    }
                }
                newId += 1;
                event.id = newId;
                event.jobs = [];
                this.events.push(event);
            } else {
                //Else we need to update an event.
                let index = this.events.findIndex(thisEvent => thisEvent.id == event.id);
                event.jobs = this.events[index].jobs;
                this.events[index] = event;
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

        // Mock Deleting Event

        if (request.url.startsWith('api/events') && request.method === 'DELETE') {
            // Get ID number

            let url = request.url.split('/');
            let id = +url[url.length - 1];

            let matchingEvents = this.events.filter(event => {
                return event.id === id;
            });

            let respBody = JSON.parse(JSON.stringify(matchingEvents[0]));

            // Get User and Permisisons

            let thisUser = this.users.filter(user => user.user.email === request.headers.get('authentication'))[0];

            if (!thisUser || !thisUser.permissions.admin) {
                for (let i = 0; i < respBody.jobs.length; i++) {
                    if ((!thisUser && respBody.jobs[i].volunteer) ||
                        (respBody.jobs[i].volunteer &&
                        respBody.jobs[i].volunteer.id !== thisUser.user.id)) {
                        respBody.jobs[i].volunteer = {
                            id: -1,
                            name: 'Volunteer'
                        };
                    }
                }
            }
            for (let i = 0; i < this.events.length; i++) {
                if (id === this.events[i].id) {
                    this.events.splice(i, 1); // Remove the event from the array
                }
            }
              return new Observable(resp => {

                resp.next(new HttpResponse({
                    status: 200,
                    body: respBody
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

            // Get user and permissions
            let thisUser = this.users.filter(user => user.user.email == request.headers.get('authentication'))[0];

            // Remove identity info if not authorized
            
            if (!thisUser || !thisUser.permissions.admin) {
                for (let i = 0; i < respBody.jobs.length; i++) {
                    if ((!thisUser && respBody.jobs[i].volunteer) ||
                        (respBody.jobs[i].volunteer &&
                        respBody.jobs[i].volunteer.id !== thisUser.user.id)) {
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
            });
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
            let user = this.users.filter(user => user.user.id == userId)[0].user;

            this.events.filter(event => {
                return event.id == eventId;
            })[0].jobs.filter(job=> {
                return job.id == jobId;
            })[0].volunteer = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            localStorage.setItem('events', JSON.stringify(this.events));

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: {}
                }));
                resp.complete();
            });
        }

        // Getting all messages
        if (request.url === 'api/message/all' && request.method === 'GET') {
            const body = conversations;

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: body
                }));
                resp.complete();
            });
        }

        if (request.url === 'api/message' && request.method === 'GET') {
            const body = [];
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].numNew > 0) {
                    const convo = {
                        id: conversations[i].id,
                        with: conversations[i].with,
                        numNew: conversations[i].numNew,
                        messages: []
                    };
                    convo.messages = convo.messages.concat(conversations[i].messages.slice(-(conversations[i].numNew)));
                    body.push(convo);
                }
            }

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: body
                }));
                resp.complete();
            });
        }

        if (request.url.startsWith('api/message/new/') && request.method === 'PUT') {
            const url = request.url.split('/');
            const conversationId = +url[3];
            const message = <Message>JSON.parse(request.body);
            message.time = new Date(message.time);
            conversations.find( convo => convo.id === conversationId ).messages.push(message);
            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: {}
                }));
                resp.complete();
            });
        }

        if (request.url.startsWith('api/message/new/') && request.method === 'PUT') {

            return new Observable(resp => {
                resp.next(new HttpResponse({
                    status: 200,
                    body: {}
                }));
                resp.complete();
            });
        }


        return next.handle(request);
    }
}

const defaultUsers = [
    {
        user: {
            id: 0,
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
    },
    {
        user: {
            id: 1,
            email: 'barry@gmail.com',
            password: 'password',
            name: 'Barry BlueJeans',
            phoneNumber: '5181234567'
        },
        permissions: {
            admin: false,
            employee: false,
            volunteer: true,
            developer: false
        }
    },
    {
        user: {
            id: 2,
            email: 'admin@gmail.com',
            password: 'password',
            name: 'Test Admin',
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
                    email: 'barry@gmail.com',
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
                    email: 'barry@gmail.com',
                }
            }
        ]
    }
];

let conversations = [
    {
        id: 0,
        with: 'Barry Bluejeans',
        numNew: 1,
        messages: [
            {
                from: 'Barry Bluejeans',
                message: 'Hey!',
                time: new Date(2018, 2, 23, 15, 43, 0, 0)
            },
            {
                from: 'Barry Bluejeans',
                message: 'Hey!',
                time: new Date(2018, 2, 23, 15, 43, 0, 0)
            },
            {
                from: 'Daniel Foote',
                message: 'Hey!',
                time: new Date(2018, 2, 23, 15, 43, 0, 0)
            },
            {
                from: 'Barry Bluejeans',
                message: 'Hey!',
                time: new Date(2018, 2, 23, 15, 43, 0, 0)
            },
            {
                from: 'Barry Bluejeans',
                message: 'Hey!',
                time: new Date(2018, 2, 23, 15, 43, 0, 0)
            }
        ]
    }
];
