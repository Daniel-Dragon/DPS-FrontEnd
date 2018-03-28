import { Component, OnInit } from '@angular/core';
import { EventService } from './core-module/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core-module/auth.service';
import { BsModalService } from 'ngx-bootstrap';
import { AddJobComponent } from './add-job.component';
import { Event, Job } from './shared-module/models';
import { UserService } from './core-module/user.service';
import { EventComponent } from './event.component';

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




});
