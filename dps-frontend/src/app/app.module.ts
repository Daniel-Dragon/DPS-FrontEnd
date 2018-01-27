import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';


import { AppComponent } from './app.component';
import { environment } from '../environments/environment';


if (environment.production) {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ...environment.imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }