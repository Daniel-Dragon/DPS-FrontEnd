import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MessageService } from './message.service';
import { AuthService } from '../core-module/auth.service';
import { Message } from '../shared-module/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    constructor(private messageService: MessageService, private auth: AuthService, private fb: FormBuilder) {}
    form: FormGroup;
    messageBox = '';
    selectedConversation = 0;
    @ViewChild('chatBody') chatBody: ElementRef;

    ngOnInit() {
        this.form = this.fb.group({
            message: ['', [Validators.minLength(1), Validators.required]]
        });
    }

    ngAfterViewInit() {
        this.scrollToBottom();
    }

    ngOnDestroy() {
        // this.messageService.markRead(this.selectedConversation);
    }

    scrollToBottom(): void {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }

    sendMessage() {
        // const messageObj = {
        //     from: this.auth.getUserInfo().name,
        //     message: this.form.controls.message.value,
        //     time: new Date()
        // };
        // this.messageService.markRead(this.selectedConversation);
        // const conversationId = this.messageService.getConversation(this.selectedConversation).ID;
        // this.form.controls.message.setValue('');
        // if (conversationId >= 0) {
        //     this.messageService.sendMessage(messageObj as Message, conversationId).subscribe();
        // } else {
        // }
        this.messageService.sendMessage(this.form.controls.message.value);
        this.form.controls.message.setValue('');
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }
}
