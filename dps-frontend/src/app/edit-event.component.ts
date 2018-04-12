import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from './core-module/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    styleUrls: [ ],
    templateUrl: './edit-event.component.html'
})
export class EditEventComponent implements OnInit {
    form;
    today;
    date;
    ID;
    name;
    startTime;
    endTime;
    description;
    modalRef: BsModalRef;

    constructor(private fb: FormBuilder,
                private eventService: EventService,
                private router: Router,
                private route: ActivatedRoute,
                private modalService: BsModalService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.ID = +params['ID'];
            if (this.ID !== -1) {
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
            const year = val.getFullYear();
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
        event.ID = this.ID;
        delete event.date;
        this.eventService.putEvent(event).subscribe(
            resp => {
                this.router.navigate(['/']);
            },
            err => {
            }
        );
    }

    DeleteEvent(event) {
        event.ID = this.ID;
        console.log('DeleteEvent Called!');
        this.eventService.removeEvent(event).subscribe(
            resp => {
                this.router.navigate(['/']);
            },
            err => {
            }
        );
    }

    private initializeEvent() {
        this.date = new Date();
        this.ID = -1;
        this.name = '';
        this.startTime = new Date();
        this.endTime = new Date();
        this.description = '';
    }

    private loadEvent() {
        this.eventService.getEvent(this.ID).subscribe(
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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
      }

      confirm(): void {
        this.DeleteEvent(this.form.value);
        this.modalRef.hide();
      }

      decline(): void {

        this.modalRef.hide();
      }

      canDeactivate(){
        if(this.form.$dirty){
            
        }
    }
    
    }

