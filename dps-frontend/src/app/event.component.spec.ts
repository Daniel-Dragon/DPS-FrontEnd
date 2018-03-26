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

    };

    const mockAuthService = {
        isAuthorized: jasmine.createSpy().and.callFake(() => {
            return;
        }),

        getUserInfo: jasmine.createSpy().and.callFake(() => {
            return;

        }),

        getPermissions: jasmine.createSpy().and.callFake(() => {
            return;

        }),

    };

    let mockRoute: ActivatedRoute;
    let mockRouter: Router;
    let mockModalService: BsModalService;

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
        mockRoute, mockRouter, mockModalService, <any>mockUserService);
    });

    // Test to ensure loadEvent is making the right calls

    it('loadEvent should make the correct call', () => {
        

    });




});
