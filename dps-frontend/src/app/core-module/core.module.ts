import { NgModule } from '@angular/core';

import { UserService } from './user.service';
import { EventService } from './event.service';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    UserService,
    EventService
  ],
  exports: [
  ]
})
export class CoreModule { }