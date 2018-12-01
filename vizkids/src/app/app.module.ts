import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LinechartComponent } from './linechart/linechart.component';
import { MapchartComponent } from './mapchart/mapchart.component';
import { BubblechartComponent } from './bubblechart/bubblechart.component';
import { AirlinesComponent } from './airlines/airlines.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LinechartComponent,
    BubblechartComponent,
    MapchartComponent,
    AirlinesComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
