import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared-module/shared.module';
import { CoreModule } from './core-module/core.module';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './home.component';
import { MainMenuComponent } from './navigation/mainMenu.component';
import { LoginComponent } from './users/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { EventService } from './core-module/event.service';
import { SettingsComponent } from './users/settings.component';
import { LoggedInGuard } from './shared-module/logged-in.guard';
import { AuthenitcationInterceptor } from './shared-module/authentication-interceptor';
import { MockBackend } from './mocks/mock_backend';

if (environment.production) {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainMenuComponent,
    LoginComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'settings', component: SettingsComponent, canActivate: [LoggedInGuard] },
      { path: '**', redirectTo: '', pathMatch: 'full'}
    ]),
    CoreModule,
  ],
  providers: [
    LoggedInGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenitcationInterceptor, multi: true },
    ...environment.providers
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent]
})
export class AppModule { }
