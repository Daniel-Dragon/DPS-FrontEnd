import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Event } from '../shared-module/models';
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
        return this.http.put('api/events/new', {headers: new HttpHeaders(JSON.stringify(eventObj))}).do(resp => {

        })
    }

    public volunteer(eventId: Number, jobId: Number, userId: Number) {
        let header = {userId: userId};
        return this.http.put('api/events/' + eventId + "/" + jobId, {headers: new HttpHeaders(JSON.stringify(header))});
    }

    public unregister(eventId: Number, jobId: Number, userId: Number) {
        let header = {userId: userId};
        return this.http.put('api/events/unregister/' + eventId + "/" + jobId, {headers: new HttpHeaders(JSON.stringify(header))});
    }

}