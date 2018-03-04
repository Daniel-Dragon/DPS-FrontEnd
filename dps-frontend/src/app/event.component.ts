import { Component, OnInit } from "@angular/core";
import { EventService } from "./core-module/event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./core-module/auth.service";

@Component({
    templateUrl: './event.component.html'
})
export class EventComponent implements OnInit {
    id: Number;
    event: Event;
    constructor(
        private eventService: EventService, 
        private authService: AuthService, 
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loadEvent();
        });
    }

    loadEvent() {
        this.eventService.getEvent(this.id).subscribe(resp => {
            this.event = <Event>resp;
        })
    }

    volunteer(jobId: Number) {
        this.eventService.volunteer(this.id, jobId, this.authService.user.id).subscribe(
            resp => {
        }, err => {
        });
    }

    unVolunteer(jobId: Number) {
        this.eventService.unregister(this.id, jobId, this.authService.user.id).subscribe(
            resp => {

            },
            err => {

            }
        )
    };
}