import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  templateUrl: './new-conversation.component.html'
})
export class NewConversationComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private modalRef: BsModalRef
    ) {}
    form: FormGroup;
    ngOnInit() {
        this.form = this.fb.group({
            with: ['', Validators.required]
        });
    }

    submit(email: string) {
        this.messageService.startConversation(email).subscribe(
            resp => {
                if (resp) {
                    this.toastr.success('Conversation Created', 'Success');
                    this.modalRef.hide();
                } else {
                    this.toastr.error('Conversation not created.', 'Error!');
                }
            }
        );
    }
}
