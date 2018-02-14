import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap';
import { Component } from '@angular/compiler/src/core';

@Injectable()
export class ModalService {
    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) {}

    public makeModal(component: Component): void {
        if (this.modalRef) {
            this.dismissModal();
        }
        this.modalRef = this.modalService.show(component);
    }

    public dismissModal(): void {
        if (this.modalRef) {
            this.modalRef.hide();
            this.modalRef = null;
        }
    }
}
