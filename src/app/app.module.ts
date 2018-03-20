import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalModule, Overlay, OverlayRenderer, DOMOverlayRenderer } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { NlccocServicesModule } from './_services/nlccoc.services.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { UnverifiedComponent } from './auth/pages/unverified/unverified.component';
import { ConfirmService } from './_services/confirm.service';
import { PagesService } from './_services/pages.service';

@NgModule({
  declarations: [
    ThemeComponent,
    AppComponent,
    UnverifiedComponent
  ],
  imports: [
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ThemeRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NlccocServicesModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [
    ScriptLoaderService, 
    ToastrService,
    PagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
