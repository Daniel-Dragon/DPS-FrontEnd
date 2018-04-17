import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { EventService } from './core-module/event.service';

import { AuthService } from './core-module/auth.service';

@Component({
    templateUrl: './add-job.component.html'
})
export class AddJobComponent implements OnInit {
    form: FormGroup;
    ID = -1;
    name = '';
    startTime = null;
    endTime = null;
    eventId = null;
    users = [];
    jobs = [];

    constructor(private modalRef: BsModalRef, private fb: FormBuilder, private eventService: EventService,
        private authService: AuthService) {}

    ngOnInit() {
        this.form = this.fb.group({
            name: [this.name, Validators.minLength(5)],
            startTime: new Date(this.startTime),
            endTime: new Date(this.endTime)
        });

        this.getUsers();
    }

    isEditing() {
        return !(this.ID === -1);
    }

    addJob(jobVal) {
        this.eventService.addJob(this.eventId, jobVal).subscribe(
            resp => {
                this.modalRef.hide();
            },
            err => {

            }
        );
    }

    // Remove volunteer function used by admin to remove a user from a job that they volunteered for

    removeVolunteer() {
        this.eventService.unregister(this.eventId, this.ID, this.authService.user.ID).subscribe(
            resp => {
                this.modalRef.hide();
            },
            err => {
                this.modalRef.hide();
            }
        );
    }

    // Change volunteer function used by admin to select a different volunteer for a job

    changeVolunteer(userId){
        this.eventService.getAllUsers().subscribe(
            resp => {
                this.users = resp;
                for (let i = 0; i < resp.length; i++) {
                    if (resp[i].ID === userId){
                        userId = resp[i].ID;
                    }
                }
            });

            this.eventService.volunteer(this.eventId, this.ID, userId).subscribe(
                resp => {
                    this.modalRef.hide();
                },
                err => {
                    this.modalRef.hide();
                }
            );
    }

    // Get Users returns an array of all registered users
    
    getUsers() {

        this.eventService.getAllUsers().subscribe(
            resp => {
                this.users = resp;
                for (let i = 0; i < this.jobs.length; i++) {
                    this.users = this.users.filter(user => (this.jobs[i].volunteer === null) || user.ID !== this.jobs[i].volunteer.ID);
                }
            });
    }

    editJob(jobVal) {
        this.eventService.updateJob(this.eventId, this.ID, jobVal).subscribe(
            resp => {
                this.modalRef.hide();
            },
            err => {

            }
        );
    }

    close() {
        this.modalRef.hide();
    }

}
