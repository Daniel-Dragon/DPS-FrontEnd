import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { EventService } from "./core-module/event.service";
import { Router } from "@angular/router";

@Component({
    styleUrls:[],
    templateUrl: './add-event.component.html'
})
export class AddEventComponent implements OnInit {
    form;
    date = new Date();
    today;

    id = -1;
    name = "";
    startTime = new Date();
    endTime = new Date();
    description = "";

    constructor(private fb: FormBuilder,
                private eventService: EventService,
                private router: Router) {}

    ngOnInit() {
        this.today = new Date();
        this.startTime.setHours(8);
        this.startTime.setMinutes(0);
        this.startTime.setSeconds(0);
        this.endTime.setHours(10);
        this.endTime.setMinutes(0);
        this.endTime.setSeconds(0);

        this.form = this.fb.group({
            name: [name, Validators.required],
            date: [this.date, Validators.required],
            startTime: [this.startTime, Validators.required],
            endTime: [this.endTime, Validators.required],
            description: [this.description, Validators.required]
        })

        this.form.get('date').valueChanges.subscribe(val => {
            let date = val.getDate();
            let month = val.getMonth();
            let year = val.getYear();
            let startTime = this.form.get('startTime');
            let endTime = this.form.get('endTime');
            startTime.value.setDate(date);
            startTime.value.setMonth(month);
            startTime.value.setYear(year);
            
            endTime.value.setDate(date);
            endTime.value.setMonth(month);
            endTime.value.setYear(year);


        })
    }

    DisableSave() {
        // TODO: Validate form.
        return false
    }

    SaveEvent(event) {
        event.id = this.id;
        delete event.date;
        this.eventService.putEvent(event).subscribe(
            resp => {
                this.router.navigate['/'];
            },
            err => {

            }
        )
    }
}