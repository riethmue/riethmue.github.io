import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComputerModelComponent } from './computer-model/computer-model.component';
import { TerminalComponent } from './terminal/terminal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutMeCardComponent } from './about-me-card/about-me-card.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { Terminal2Component } from './terminal2/terminal2.component';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { ModalComponent } from './modal/modal.component';
@NgModule({
  declarations: [
    AppComponent,
    ComputerModelComponent,
    TerminalComponent,
    AboutMeCardComponent,
    Terminal2Component,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ScullyLibModule,
    OverlayModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
