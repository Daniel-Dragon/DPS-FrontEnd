import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Event, Job } from '../shared-module/models';
import 'rxjs/Rx'


@Injectable()
export class EventService {
    userName : string = "Test Username"
    authentication;

    constructor(public http: HttpClient) {}
    
    public getEvents() {
        return this.http.get('api/events').do(resp => {

        });
    }

    public getEvent(eventId: Number) {
        return this.http.get('api/events/' + eventId).do(resp => {

        });
    }

    public createEvent(eventObj: Event) {
        let body = {event: eventObj}
        return this.http.put('api/events/new', body).do(resp => {

        })
    }

    public volunteer(eventId: Number, jobId: Number, userId: Number) {
        let body = JSON.stringify({userId: userId});
        return this.http.put('api/events/' + eventId + "/" + jobId, body);
    }

    public unregister(eventId: Number, jobId: Number, userId: Number) {
        let body = JSON.stringify({userId: userId});
        return this.http.put('api/events/unregister/' + eventId + "/" + jobId, body);
    }

    public addJob(eventId: Number, jobVal: Job) {
        jobVal.id = -1;
        let body = JSON.stringify(jobVal);
        return this.http.put('api/events/job/' + eventId, body);
    }

    public updateJob(eventId: number, jobId: number, jobVal: Job) {
        jobVal.id = jobId;
        let body = JSON.stringify(jobVal);
        return this.http.put('api/events/job/' + eventId, body);
    }
}