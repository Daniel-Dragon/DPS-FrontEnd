import { Component, OnInit } from '@angular/core';
import { EventService } from './core-module/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core-module/auth.service';
import { BsModalService } from 'ngx-bootstrap';
import { AddJobComponent } from './add-job.component';
import { Event, Job } from './shared-module/models';
import { UserService } from './core-module/user.service';
import { EventComponent } from './event.component';
import { Volunteer } from './shared-module/models';
import { User } from './shared-module/models';

describe('EventComponent', () => {
    
    const mockEventService = {
        createEvent: jasmine.createSpy().and.callFake(() => {
            return { map: () => {} };
        }),

        volunteer: jasmine.createSpy().and.callFake(() => {
            return { map: () => {}};
        }),

        getEvent: jasmine.createSpy().and.callFake(() => {
            return { map: () => {} };
        })

    };

    const mockAuthService = {
        isAuthorized: jasmine.createSpy().and.callFake(() => {
            return {
                subscribe: func => {
                    func(true);
                }
            };
        }),

        getUserInfo: jasmine.createSpy().and.callFake(() => {
            return;

        }),

        getPermissions: jasmine.createSpy().and.callFake(() => {
            return;

        }),

    };

    const mockRoute = {
        route: {
            params: func => {
                const param = {id: 1};
                func(param);
            }
        }
    };
    const mockRouter = {};
    const mockModalService = {
        onHide: { subscribe: jasmine.createSpy() },

        show: jasmine.createSpy(),
    };

    const mockUserService = {
        login: jasmine.createSpy().and.callFake(() => {
            return { map: () => {}};
        }),

        register: jasmine.createSpy().and.callFake(() => {
            return { map: () => {}};
        }),

        updateUser: jasmine.createSpy().and.callFake(() => {
            return { map: () => {}};

        }),
    };

    let component;
    beforeEach( () => {
     component = new EventComponent(<any>mockEventService, <any>mockAuthService,
        <any>mockRoute, <any>mockRouter, <any>mockModalService, <any>mockUserService);
    });

    // Test to ensure loadEvent is making the right calls

    it('loadEvent should make the correct call', () => {
        const event = {
            id: 1,
        };

        mockEventService.getEvent = jasmine.createSpy().and.callFake( () => {
            return{
                subscribe: func => {
                    func(1);
                }
            };
        });
        component.loadEvent();
        expect(component.event).toBe(1);

    });

    // Test to ensure 'addJob' method is making the correct call

    it('addJob should make the right call', () => {
        const mockEvent = {
            EventService: mockEventService,
            startTime: 1200,
            endTime: 1400,
            id: 5,
        };

        const mockInitialState = {
            startTime: new Date(mockEvent.startTime),
            endTime: new Date(mockEvent.endTime),
            eventId: mockEvent.id,
        };

        component.event = mockEvent;
        component.BsModalService = mockModalService;
        component.addJob();
        expect(mockModalService.show).toHaveBeenCalledWith(jasmine.any(Function), { initialState: mockInitialState});

    });

    // Test to ensure 'editJob' makes the right call with the correct parameters

    it('editJob should make the right call', () => {
        const mockVolunteer: Volunteer = {
            id: 9,
            name: 'TestVolunteer',
            email: 'doesntmatter@whocares.com',
        };
        const mockJob: Job = {
            id: 4,
            name: 'TestJob',
            startTime: new Date(1200, 1, 1, 1),
            endTime: new Date(1400, 1, 1, 1),
            volunteer: mockVolunteer,
        };
        const mockEvent: Event = {
            description: 'Event used for testing',
            name: 'TestEvent',
            startTime: new Date(1200, 1, 1, 1),
            endTime: new Date(1400, 1, 1, 1),
            id: 5,
            jobs: [mockJob],
        };
       component.event = mockEvent;
        const jobId = mockEvent.jobs[0].id;
        const mockInitialState: any = mockEvent.jobs.filter(job => job.id === jobId)[0];
        mockInitialState.eventId = mockEvent.id;
        component.editJob(jobId);
        expect(mockModalService.show).toHaveBeenCalledWith(jasmine.any(Function), { initialState: mockInitialState});
    });

    // Test to ensure 'getClasses' method is making the correct calls

    it('getClasses should make the right call', () => {
        const mockClasses = [];
        const mockUser: User = {
            id: 5,
            name: 'Randy Lahey',
            email: 'whocares@doesntmatter.com',
            phoneNumber: '1234567890',
        };
        const mockVolunteer: Volunteer = {
            id: 5,
            name: 'Randy Lahey',
            email: 'whocares@doesntmatter.com',
        };
        const mockJob: Job = {
            id: 7,
            name: 'TestJob2',
            startTime: new Date(1200, 1, 1, 1),
            endTime: new Date(1400, 1, 1, 1),
            volunteer: mockVolunteer,
        };
        component.AuthService = mockAuthService;
        component.getClasses(mockJob);
        expect(mockAuthService.getUserInfo).toHaveBeenCalled();
    });
});
