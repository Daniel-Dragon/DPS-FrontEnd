import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './home-Component/home.component';
import { MainMenuComponent } from './mainMenu-component/mainMenu.component';
import { SubMenuComponent } from './subMenu-component/subMenu.component';


if (environment.production) {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainMenuComponent,
    SubMenuComponent
  ],
  imports: [
    BrowserModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full'}
    ]),
    ...environment.imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }