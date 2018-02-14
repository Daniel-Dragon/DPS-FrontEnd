import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared-module/shared.module';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './home-component/home.component';
import { MainMenuComponent } from './mainMenu-component/mainMenu.component';
import { SubMenuComponent } from './subMenu-component/subMenu.component';
import { CoreModule } from './core-module/core.module';
import { LoginComponent } from './login.component/login.component';


if (environment.production) {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainMenuComponent,
    SubMenuComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full'}
    ]),
    CoreModule,
    ...environment.imports
  ],
  providers: [],
  bootstrap: [AppComponent, LoginComponent]
})
export class AppModule { }
