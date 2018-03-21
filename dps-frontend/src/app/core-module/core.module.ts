import { NgModule } from '@angular/core';

import { UserService } from './user.service';
import { EventService } from './event.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    UserService,
    EventService,
    AuthService
  ],
  exports: [
  ]
})
export class CoreModule { }
