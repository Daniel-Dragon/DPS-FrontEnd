import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Conversation, Message} from '../shared-module/models';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';


@Injectable()
export class MessageService {
    public messageDelay = 60000;
    public conversations: Conversation[] = [];
    public numNew: number;

    constructor(private http: HttpClient, private toastr: ToastrService) {
        // TODO request an update every 30 seconds.
        this.http.get('api/message/all').subscribe(
            resp => {
                this.conversations = resp as Conversation[];
                this.repeatCheckNew().subscribe();
            },
            err => {
                this.toastr.error('Something went wrong and messages can\'t be retrieved!', 'Error');
            }
        );
    }

    private repeatCheckNew() {
        return Observable
            .timer(5000, this.messageDelay)
            .flatMap(
                () => {
                    return this.checkNew();
                }
            );
    }

    private checkNew(): Observable<void> {
        return this.http.get('api/message').map(
            resp => {
                let response = resp as Conversation[];
                for (let i = 0; i < response.length; i++) {
                    let index = this.conversations.findIndex(
                        conversation => {
                            return conversation.id === response[i].id;
                        }
                    );

                    // This is a new conversation
                    if (index < 0) {
                        this.conversations.push(response[index]);
                    }

                    // Check if we have more new messages.
                    if (this.conversations[index].numNew < response[i].numNew) {
                        const numNewMessages = response[i].numNew - this.conversations[index].numNew;
                        this.conversations[index].numNew = response[i].numNew;
                        this.conversations[index].messages =
                            this.conversations[index].messages.concat(response[i].messages.splice(-(numNewMessages)));
                    }
                }
            },
            err => {

            }
        )
    }

    markRead(index: number): void {
        if (this.conversations[index]) {
            // TODO Make call to set conversation to read.
            this.numNew -= this.conversations[index].numNew;
            this.conversations[index].numNew = 0;
        }
    }

    getConversation(index: number): Conversation {
        if (index >= 0 && index < this.conversations.length) {
            return this.conversations[index];
        } else {
            return {
                id: -1,
                with: 'None',
                numNew: 0,
                messages: []
            };
        }
    }

    getConversations(): Conversation[] {
        return this.conversations;
    }

    startConversation(email: string): Observable<boolean> {
        const body = JSON.stringify({with: email});
        return this.http.put('api/message/new/convo', body).map(
            resp => {
                return true;
            },
            err => {
                return false;
            }
        );
    }

    sendMessage(message: Message, conversationId: number) {
        const body = JSON.stringify(message);
        return this.http.put('api/message/new/' + conversationId, body).map(
            resp => {
                return;
            },
            err => {
                this.toastr.error('Message not sent', 'Error!');
                return;
            }
        );
    }

}
