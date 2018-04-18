import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Event, Job } from '../shared-module/models';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared-module/models';
import 'rxjs/add/operator/do';


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

    public getAllUsers(): Observable<User[]> {

        return this.http.get('api/user').map(resp => {
            return resp as User[];
        });

    }
    public adminVolunteer(eventId: Number, jobId: Number, userId: Number, userName: String)  {
        const body = {userId: userId};
        
        return this.http.put('api/events/' + eventId + '/' + jobId, body).do(
            resp => {
                this.toastr.success('You have successfully volunteered ' + userName + ' for this position.', 'Success!');
            },
            err => {
                this.toastr.error('There was an error with registering ' + userName + ' for this job, please refresh and try again.', 'Error');
            }
        );
    }

    public volunteer(eventId: Number, jobId: Number, userId: Number): Observable<void> {
        const body = {userId: userId};
        return this.http.put('api/events/' + eventId + '/' + jobId, body).map(
            resp => {
                this.toastr.success('You have successfully volunteered for this position.', 'Success!');
            },
            err => {
                this.toastr.error('There was an error with registering you for this job, please refresh and try again.', 'Error');
            }
        );
    }

    public adminUnregister(eventId: Number, jobId: Number, userId: Number, userName: String): Observable<void> {
        const body = JSON.stringify({userId: userId});  
        return this.http.put('api/events/unregister/' + eventId + '/' + jobId, body).map(
            resp => {
                this.toastr.success('You have unregistered ' + userName + ' for this job.', 'Success!');
            },
            err => {
                this.toastr.error('There was an error unregistering ' + userName + ' from this job.', 'Error');
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
        const body: any = Object.assign({}, jobVal);
        body.ID = -1;
        body.startTime = body.startTime.getTime();
        body.endTime = body.endTime.getTime();
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

    public updateJob(eventId: number, jobId: number, jobVal: Job): Observable<void> {
        const body: any = Object.assign({}, jobVal);
        body.ID = jobId;
        body.startTime = body.startTime.getTime();
        body.endTime = body.endTime.getTime();
        return this.http.put('api/events/job/' + eventId, body).map(
            resp => {
                return;
            },
            err => {
                this.toastr.error('There was an error updating this job, please refresh and try again.', 'Error');
                return;
            }
        );

    }

    public deleteJob(eventId: number, jobId: number): Observable<void> {
        return this.http.delete('api/events/' + eventId + '/' + jobId).map(

            resp => {
                return;
            },
            err => {
                this.toastr.error('There was an error removing this job, please refresh and try again.', 'Error');
                return;
            }
        );
    }

    public putEvent(event: Event): Observable<void> {
        const body = {
            ID: event.ID,
            name: event.name,
            startTime: event.startTime.getTime(),
            endTime: event.endTime.getTime(),
            description: event.description
        };
        return this.http.put('api/events', body).map(
            resp => {
                return;
            },
            err => {
                this.toastr.error('There was an error creating this Event, please refresh and try again.', 'Error');
                return;
            }
        );
    }

    public removeEvent(event: Event) {
        console.log('Delete ID: ' + event.ID);
        return this.http.delete('api/events/' + event.ID).map(
                resp => {
                    return;
                },
                err => {
                    this.toastr.error('There was an error removing this Event, please refresh and try again.', 'Error');
                }
        );
    }
}
