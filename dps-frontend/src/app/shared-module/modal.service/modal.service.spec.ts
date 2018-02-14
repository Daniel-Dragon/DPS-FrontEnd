import { ModalService } from './modal.service';
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({})
export class MockComponent {}
describe('ModalService', () => {
    let service: ModalService;
    let mockModalService;
    let modalRef;
    const mockComponent = new MockComponent();

    beforeEach(() => {
        modalRef = {
            hide: jasmine.createSpy()
        };
        mockModalService = {
            show: jasmine.createSpy().and.returnValue(modalRef)
        };
        service = new ModalService(mockModalService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call modal show when makeModal is called', () => {
        service.makeModal(mockComponent);
        expect(mockModalService.show).toHaveBeenCalled();
    });

    it('should cancel old modal if two are called sequentially', () => {
        service.makeModal(mockComponent);
        service.makeModal(mockComponent);
        expect(modalRef.hide).toHaveBeenCalled();
    });

    it('Should call hide if there is a modal to hide', () => {
        service.makeModal(mockComponent);
        service.dismissModal();
        expect(modalRef.hide).toHaveBeenCalled();
    });

    it('Shouldn\'t call hide if no modal is shown', () => {
        service.dismissModal();
        expect(modalRef.hide).not.toHaveBeenCalled();
    });
});
