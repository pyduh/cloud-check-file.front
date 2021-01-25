import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UploadComponent } from './pages/upload/upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { DndDirective } from './directives/dnd.directive';
import { ProgressComponent } from './shared/progress/progress.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StorageService } from './services/storage.services';
import { DomainServices } from './services/domain.services';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AuthGuardService } from './services/auth-guard.services';


import { InitialsIconComponent } from './shared/initials-icon/initials-icon';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { FullComponent } from './pages/full/full.component';
import { FooterComponent } from './pages/footer/footer.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateHelperComponent } from './shared/create-helper/create-helper.component';
import { UserComponent } from './pages/user/user.component';

import { ListComponent as TransactionList } from './pages/transactions/list/list.component'
import { AddComponent as TransactionAdd } from './pages/transactions/add/add.component'


@NgModule({
  declarations: [
    AppComponent, 
    UploadComponent, 
    ProgressComponent, 
    DndDirective, 
    CreateHelperComponent,
    InitialsIconComponent, 
    NavbarComponent,
    LoginComponent,
    FullComponent,
    FooterComponent,
    HomeComponent,
    UserComponent,
    NotFoundComponent,
    TransactionAdd,
    TransactionList,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    NgxSpinnerModule,
    ToastrModule.forRoot()
  ],
  providers: [StorageService, DomainServices, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
