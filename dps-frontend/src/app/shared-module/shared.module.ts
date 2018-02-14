import { NgModule } from '@angular/core';
import { CollapseModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { ModalService } from './modal.service/modal.service';

@NgModule({
    imports: [
        ModalModule.forRoot()
    ],
    providers: [
        ModalService
    ],
    exports: [
    ]
})
export class SharedModule {}
