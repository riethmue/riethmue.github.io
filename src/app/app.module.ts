import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComputerModelComponent } from './computer-model/computer-model.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutMeCardComponent } from './about-me-card/about-me-card.component';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { ModalComponent } from './modal/modal.component';
import { TerminalComponent } from './terminal/terminal.component';
@NgModule({
  declarations: [
    AppComponent,
    ComputerModelComponent,
    TerminalComponent,
    AboutMeCardComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    OverlayModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
