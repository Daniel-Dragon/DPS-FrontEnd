import { Component, OnInit } from '@angular/core';
import { EventService } from './core-module/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core-module/auth.service';
import { BsModalService } from 'ngx-bootstrap';
import { AddJobComponent } from './add-job.component';
import { Event, Job } from './shared-module/models';
import { UserService } from './core-module/user.service';

@Component({
    styleUrls: ['./event.component.css'],
    templateUrl: './event.component.html'
})
export class EventComponent implements OnInit {
    ID: Number;
    event: Event;
    constructor(
        private eventService: EventService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.ID = +params['ID'];
            this.loadEvent();
        });
        this.userService.onAuthChange.subscribe(resp => this.loadEvent());
    }

    loadEvent() {
        this.eventService.getEvent(this.ID).subscribe(resp => {
            this.event = <Event>resp;
        });
    }

    volunteer(jobId: Number) {
        this.eventService.volunteer(this.ID, jobId, this.authService.user.ID).subscribe(
            resp => {
                this.loadEvent();
            }, err => {
                this.loadEvent();
            }
        );
    }

    unVolunteer(jobId: Number) {
        this.eventService.unregister(this.ID, jobId, this.authService.user.ID).subscribe(
            resp => {
                this.loadEvent();
            },
            err => {
                this.loadEvent();
            }
        );
    }

    addJob() {
        const initialState = {
            startTime: new Date(this.event.startTime),
            endTime: new Date(this.event.endTime),
            eventId: this.event.ID
        };
        this.modalService.onHide.subscribe(resp => this.loadEvent());
        this.modalService.show(AddJobComponent, {initialState: initialState});
    }

    editJob(jobId) {
        const initialState: any = this.event.jobs.filter(job => job.ID === jobId)[0];
        initialState.eventId = this.event.ID;
        this.modalService.onHide.subscribe(resp => this.loadEvent());
        this.modalService.show(AddJobComponent, {initialState: initialState});
    }

    getClasses(job: Job) {
        const classes = [];
        const user = this.authService.getUserInfo();
        if (job.volunteer) {
            if (user && job.volunteer.ID === user.ID) {
                classes.push('panel-success');
            } else {
                classes.push('panel-danger');
            }
        } else {
            if (user && this.event.jobs.findIndex(job => {
                return job.volunteer && job.volunteer.ID === user.ID;
            }) >= 0) {
                classes.push('panel-warning');
            }
            else {
                classes.push('panel-primary');
            }
        }
        return classes;
    }

    isVolunteered() {
        const user = this.authService.getUserInfo();
        return (user &&
            this.event.jobs.findIndex(job => {
                return job.volunteer && job.volunteer.ID === user.ID;
            }) >= 0);
    }
}
