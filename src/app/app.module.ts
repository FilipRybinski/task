import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularPaginatorModule } from 'angular-paginator';
import { HttpClientModule } from '@angular/common/http';
import { SummaryComponent } from './summary/summary.component';
import { ClientManagementComponent } from './client-management/client-management.component';
import { ProjectsManagementComponent } from './projects-management/projects-management.component';
import { TestsManagementComponent } from './tests-management/tests-management.component';
import { NavbarComponent } from './navbar/navbar.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { TaskManagementComponent } from './task-management/task-management.component';

@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    ClientManagementComponent,
    ProjectsManagementComponent,
    TestsManagementComponent,
    NavbarComponent,
    TaskManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularPaginatorModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2OrderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
