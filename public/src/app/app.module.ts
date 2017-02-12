import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './shared/login.component';
import { MyHolidayComponent } from './staff/my-holiday/my-holiday.component';
import { RequestHolidayComponent } from './staff/request-holiday/request-holiday.component';
import { UserHomeComponent } from './staff/user-home/user-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { StaffComponent } from './staff/staff.component';
import { AdminComponent } from './admin/admin.component';
import { routing } from './app.routing';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MyHolidayComponent,
    RequestHolidayComponent,
    UserHomeComponent,
    AdminHomeComponent,
    StaffComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MaterialModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
