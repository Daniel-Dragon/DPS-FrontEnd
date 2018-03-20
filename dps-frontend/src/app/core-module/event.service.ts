import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Event, Job } from '../shared-module/models';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class EventService {
    authentication;

    constructor(public http: HttpClient, private toastr: ToastrService) {}

    public getEvents() {
        return this.http.get('api/events').do(resp => {

        });
    }

    public getEvent(eventId: Number): Observable<Event> {
        return this.http.get('api/events/' + eventId).map(resp => {
            return resp as Event;
        });
    }

    public createEvent(eventObj: Event): Observable<void> {
        const body = {event: eventObj};
        return this.http.put('api/events/new', body).map(resp => {

        });
    }

    public volunteer(eventId: Number, jobId: Number, userId: Number): Observable<void> {
        const body = JSON.stringify({userId: userId});
        return this.http.put('api/events/' + eventId + '/' + jobId, body).map(
            resp => {
                this.toastr.success('You have successfully volunteered for this position.', 'Success!');
            },
            err => {
                this.toastr.error('There was an error with registering you for this job, please refresh and try again.', 'Error');
            }
        );
    }

    public unregister(eventId: Number, jobId: Number, userId: Number) {
        const body = JSON.stringify({userId: userId});
        return this.http.put('api/events/unregister/' + eventId + '/' + jobId, body).do(
            resp => {
                this.toastr.success('You have unregistered for this job.', 'Success!');
            },
            err => {
                this.toastr.error('There was an error unregistering you from this job.', 'Error');
            }
        );
    }

    public addJob(eventId: Number, jobVal: Job) {
        jobVal.id = -1;
        const body = JSON.stringify(jobVal);
        return this.http.put('api/events/job/' + eventId, body).do(
            resp => {
                this.toastr.success('The job ' + jobVal.name + ' has been added.', 'Job Added');
            },
            err => {
                this.toastr.error();
                this.toastr.error('There was an error adding this job, please refresh and try again.', 'Error');
            }
        );
    }

    public updateJob(eventId: number, jobId: number, jobVal: Job) {
        jobVal.id = jobId;
        const body = JSON.stringify(jobVal);
        return this.http.put('api/events/job/' + eventId, body);
    }

    public putEvent(event: Event) {
        return this.http.put('api/events', event);
    }
}