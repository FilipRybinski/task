import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientManagementComponent } from './client-management/client-management.component';
import { ProjectsManagementComponent } from './projects-management/projects-management.component';
import { SummaryComponent } from './summary/summary.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { TestsManagementComponent } from './tests-management/tests-management.component';
const routes: Routes = [
  {redirectTo:"summary",path:'',pathMatch:'full'},
  {path:'summary',component:SummaryComponent},
  {path:'client-management',component:ClientManagementComponent},
  {path:'projects-management',component:ProjectsManagementComponent},
  {path:'tests-management',component:TestsManagementComponent},
  {path:'task-management',component:TaskManagementComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
