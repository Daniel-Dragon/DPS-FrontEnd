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


















});
