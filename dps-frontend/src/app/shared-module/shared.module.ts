import { NgModule } from '@angular/core';
import { CollapseModule, BsDropdownModule, BsModalService, ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        BsModalService
    ],
    exports: [
    ]
})
export class SharedModule {}
