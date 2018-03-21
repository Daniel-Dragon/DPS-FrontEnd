import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from './core-module/event.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    styleUrls: [ ],
    templateUrl: './edit-event.component.html'
})
export class EditEventComponent implements OnInit {
    form;
    today;

    date;
    id;
    name;
    startTime;
    endTime;
    description;

    constructor(private fb: FormBuilder,
                private eventService: EventService,
                private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id !== -1) {
                this.loadEvent();
            } else {
                this.initializeEvent();
            }
        });
        this.today = new Date();
        this.startTime.setHours(8);
        this.startTime.setMinutes(0);
        this.startTime.setSeconds(0);
        this.endTime.setHours(10);
        this.endTime.setMinutes(0);
        this.endTime.setSeconds(0);

        this.form = this.fb.group({
            name: [this.name, Validators.required],
            date: [this.date, Validators.required],
            startTime: [this.startTime, Validators.required],
            endTime: [this.endTime, Validators.required],
            description: [this.description, Validators.required]
        });

        this.form.get('date').valueChanges.subscribe(val => {
            const date = val.getDate();
            const month = val.getMonth();
            const year = val.getYear();
            const startTime = this.form.get('startTime');
            const endTime = this.form.get('endTime');
            startTime.value.setDate(date);
            startTime.value.setMonth(month);
            startTime.value.setYear(year);

            endTime.value.setDate(date);
            endTime.value.setMonth(month);
            endTime.value.setYear(year);


        });
    }

    DisableSave() {
        // TODO: Validate form.
        return false;
    }

    SaveEvent(event) {
        event.id = this.id;
        delete event.date;
        this.eventService.putEvent(event).subscribe(
            resp => {
                this.router.navigate(['/']);
            },
            err => {
            }
        );
    }

    private initializeEvent() {
        this.date = new Date();
        this.id = -1;
        this.name = '';
        this.startTime = new Date();
        this.endTime = new Date();
        this.description = '';
    }

    private loadEvent() {
        this.eventService.getEvent(this.id).subscribe(
            resp => {
                this.date = new Date(resp.startTime);
                this.name = resp.name;
                this.startTime = new Date(resp.startTime);
                this.endTime = new Date(resp.endTime);
                this.description = resp.description;
            },
            err => {

            }
        );
    }
}
