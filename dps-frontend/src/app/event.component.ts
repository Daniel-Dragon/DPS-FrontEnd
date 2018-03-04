import { Component, OnInit } from "@angular/core";
import { EventService } from "./core-module/event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./core-module/auth.service";
import { BsModalService } from "ngx-bootstrap";
import { AddJobComponent } from "./add-job.component";
import { Event } from "./shared-module/models";
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
}