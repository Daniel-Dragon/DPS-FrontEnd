import { Component, OnInit } from "@angular/core";
import { EventService } from "./core-module/event.service";

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    events;
    constructor(public eventService: EventService) {}

    ngOnInit() {
        this.eventService.getEvents().subscribe(resp => {
            this.events = resp;
        });
    }
}