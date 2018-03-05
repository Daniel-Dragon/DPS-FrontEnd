import { Component, OnInit } from "@angular/core";
import { EventService } from "./core-module/event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./core-module/auth.service";
import { BsModalService } from "ngx-bootstrap";
import { AddJobComponent } from "./add-job.component";
import { Event, Job } from "./shared-module/models";
import { UserService } from "./core-module/user.service";

@Component({
    styleUrls:['./event.component.css'],
    templateUrl: './event.component.html'
})
export class EventComponent implements OnInit {
    id: Number;
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
            this.id = +params['id'];
            this.loadEvent();
        });
        this.userService.onAuthChange.subscribe(resp => this.loadEvent());
    }

    loadEvent() {
        this.eventService.getEvent(this.id).subscribe(resp => {
            this.event = <Event>resp;
        })
    }

    volunteer(jobId: Number) {
        this.eventService.volunteer(this.id, jobId, this.authService.user.id).subscribe(
            resp => {
                this.loadEvent();
            }, err => {
                this.loadEvent();
            }
        );
    }

    unVolunteer(jobId: Number) {
        this.eventService.unregister(this.id, jobId, this.authService.user.id).subscribe(
            resp => {
                this.loadEvent();
            },
            err => {
                this.loadEvent();
            }
        )
    };

    addJob() {
        let initialState = {
            startTime: new Date(this.event.startTime),
            endTime: new Date(this.event.endTime),
            eventId: this.event.id
        }
        this.modalService.onHide.subscribe(resp => this.loadEvent());
        this.modalService.show(AddJobComponent, {initialState: initialState});
    }

    editJob(jobId) {
        let initialState: any = this.event.jobs.filter(job => job.id == jobId)[0];
        initialState.eventId = this.event.id;
        this.modalService.onHide.subscribe(resp => this.loadEvent());
        this.modalService.show(AddJobComponent, {initialState: initialState});
    }

    getClasses(job: Job) {
        // {'panel-primary': !job.volunteer, 'panel-danger': job.volunteer?.id != authService.getUserInfo()?.id, 'panel-success': job.volunteer?.id == authService.getUserInfo()?.id}
        let classes = [];
        let user = this.authService.getUserInfo();
        if(job.volunteer) {
            if (user && job.volunteer.id == user.id) {
                classes.push('panel-success');
            } else {
                classes.push('panel-danger');
            }
        } else {
            if(user && this.event.jobs.findIndex(job => {
                return job.volunteer && job.volunteer.id == user.id
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
        let user = this.authService.getUserInfo();
        return (user && this.event.jobs.findIndex(job => {
            return job.volunteer && job.volunteer.id == user.id
        })) >= 0
    }
}