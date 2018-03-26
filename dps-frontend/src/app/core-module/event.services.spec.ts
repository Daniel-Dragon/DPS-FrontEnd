import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Event, Job } from '../shared-module/models';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../core-module/event.service';

describe('EventService', () => {
    const mockHttp = {
        get: jasmine.createSpy().and.callFake(() => {
            return { map: () => {}};

        }),

        put: jasmine.createSpy().and.callFake(() => {
            return { map: () => {}};
        })
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
        service = new EventService(<any>mockHttp, <any>mockToastr);
    });

    // Test to ensure 'getEvents' method references correct api

    it('getEvents should make the correct call', () => {
        service.getEvents();
        expect(mockHttp.get).toHaveBeenCalledWith('api/events');
    });

    // Test to ensure 'getEvent' method references correct api

    it('getEvent should make the correct call', () => {
        service.getEvents();
        expect(mockHttp.get).toHaveBeenCalledWith('api/events');
    });

    // Test to ensure 'volunteer' method references correct api

    it('volunteer should make the correct call', () => {
        const event = {
            eventId: 1,
            jobId: 1,
            userId: 1,
        };
        service.volunteer(event.eventId, event.jobId, event.userId);
        const body = JSON.stringify({userId: event.userId});
        expect(mockHttp.put).toHaveBeenCalledWith('api/events/' + event.eventId + '/' + event.jobId, body);
    });

    // Test to ensure 'uregister' method references correct api

    it('unregister should make the correct call', () => {
        const event = {
            eventId: 1,
            jobId: 1,
            userId: 1,
        };
        service.unregister(event.eventId, event.jobId, event.userId);
        const body = JSON.stringify({userId: event.userId});
        expect(mockHttp.put).toHaveBeenCalledWith('api/events/unregister/' + event.eventId + '/' + event.jobId, body);
    });

    // Test to ensure 'addJob' method references correct api

    it('addJob should make the correct call', () => {
        const job = {
            jobId: -1,
        };

        const event = {
            eventId: -1,
            userId: 1,
        };
        service.addJob(event.eventId, job);
        const body = JSON.stringify(job);
        expect(mockHttp.put).toHaveBeenCalledWith('api/events/job/' + event.eventId, body);

    });

});
