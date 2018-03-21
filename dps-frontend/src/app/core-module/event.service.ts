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

    public getEvents(): Observable<Event[]> { 
        return this.http.get('api/events').map(resp => {
            return resp as Event[];
        });
    }

    public getEvent(eventId: Number): Observable<Event> {
        return this.http.get('api/events/' + eventId).map(resp => {
            return resp as Event;
        });
    }

    public createEvent(eventObj: Event): Observable<Event> {
        const body = {event: eventObj};
        return this.http.put('api/events/new', body).map(resp => {
          return resp as Event;

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

    public unregister(eventId: Number, jobId: Number, userId: Number): Observable<void> {
        const body = JSON.stringify({userId: userId});
        return this.http.put('api/events/unregister/' + eventId + '/' + jobId, body).map(
            resp => {
                this.toastr.success('You have unregistered for this job.', 'Success!');
            },
            err => {
                this.toastr.error('There was an error unregistering you from this job.', 'Error');
            }
        );
    }

    public addJob(eventId: Number, jobVal: Job): Observable<Job> {
        jobVal.id = -1;
        const body = JSON.stringify(jobVal);
        return this.http.put('api/events/job/' + eventId, body).map(
            resp => {
                this.toastr.success('The job ' + jobVal.name + ' has been added.', 'Job Added');
               return resp as Job;
            },
            err => {
                this.toastr.error();
                this.toastr.error('There was an error adding this job, please refresh and try again.', 'Error');
            }
        );
    }

    public updateJob(eventId: number, jobId: number, jobVal: Job) { //Unsure of return type, would it just be the updated job itself?
        jobVal.id = jobId;
        const body = JSON.stringify(jobVal);
        return this.http.put('api/events/job/' + eventId, body);
        
    }

    public putEvent(event: Event) { //Unsure of return type, does not like 'Observable<Event>'
        return this.http.put('api/events', event);
    }
}