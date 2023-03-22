import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { Patient,PatientType } from './patient.model';
import { Project,ProjectType } from './project.model';
import { Test_Collection, Test_CollectionType } from './test_collection';
import { Test, TestType } from './test';
import { Task, TaskType } from './task';
const url="http://localhost:3000/";
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
   GetAllPatients():Observable<Patient[]>{
    return this.http.get<PatientType[]>(url+"patients").pipe(map(
      (patients:{
        id:number;
        first_name:string;
        last_name:string;
        assigned_projects:any[];
      }[])=> patients.map(patient=>{
        return new Patient(patient.id,patient.first_name,patient.last_name,patient.assigned_projects);
      })
      ))
  }
  GetAllProjects():Observable<Project[]>{
    return this.http.get<ProjectType[]>(url+"projects").pipe(map(
      (projects:{
        id:number
        name:string;
        description:string;
      }[])=>projects.map(project=>{
        return new Project(project.id,project.name,project.description);
      })
    ))
  }
  GetAllTest_Collection():Observable<Test_Collection[]>{
    return this.http.get<Test_CollectionType[]>(url+"tests").pipe(map(
      (tests:{
      id:number
      name:string;
      tests:Test[];
    }[])=>tests.map(test=>{
      return new Test_Collection(test.id,test.name,test.tests);
    })
    ))
  }
  GetAllTest():Observable<Test[]>{
    return this.http.get<TestType[]>(url+"test").pipe(map(
      (tests:{
        id:number
        name:string;
        result:string;
    }[])=>tests.map(test=>{
      return new Test(test.id,test.name,test.result);
    })
    ))
  }
  GetAllTasks():Observable<Task[]>{
    return this.http.get<TaskType[]>(url+"tasks").pipe(map(
      (tasks:{
      id:number
      tests:Test_Collection;
      project:Project;
      patient:Patient
      status:boolean;
      date:Date;
    }[])=>tasks.map(task=>{
      return new Task(task.id,task.tests,task.project,task.patient,task.status,task.date);
    })
    ))
  }
  DeleteProject(id:number):Observable<Project>{
    return this.http.delete<Project>(url+"projects/"+id).pipe(map((res:Project)=>{
      return res;
    }));
  }
  DeletePatient(id:number):Observable<Patient>{
    return this.http.delete<Patient>(url+"patients/"+id).pipe(map((res:Patient)=>{
      return res;
    }));
  }
  DeleteTask(id:number):Observable<Task>{
    return this.http.delete<Task>(url+"tasks/"+id).pipe(map((res:Task)=>{
      return res;
    }));
  }
  DeleteTest(id:number):Observable<Test>{
    return this.http.delete<Test>(url+"test/"+id).pipe(map((res:Test)=>{
      return res;
    }));
  }
  DeleteTests(id:number):Observable<Test_Collection>{
    return this.http.delete<Test_Collection>(url+"tests/"+id).pipe(map((res:Test_Collection)=>{
      return res;
    }));
  }
  AddTestToTestCollection(obj:Test_Collection){
    return this.http.put<Test_Collection>(url+"tests/"+obj.id,obj).pipe(map((res:Test_Collection)=>{
      return res;
    }))
  }
  AddTestCollection(obj:Test_Collection){
    return this.http.post<Test_Collection>(url+"tests",obj).pipe(map((res:Test_Collection)=>{
      return res;
    }))
  }
  AddTest(obj:Test){
    return this.http.post<Test>(url+"test",obj).pipe(map((res:Test)=>{
      return res;
    }))
  }
  AddPatient(obj:Patient):Observable<Patient>{
    return this.http.post<Patient>(url+"patients",obj).pipe(map((res:Patient)=>{
      return res;
    }))
  }
  AddProject(obj:Project):Observable<Project>{
    return this.http.post<Project>(url+"projects",obj).pipe(map((res:Project)=>{
      return res;
    }))
  }
  AddTask(obj:Task):Observable<Task>{
    return this.http.post<Task>(url+"tasks",obj).pipe(map((res:Task)=>{
      return res;
    }))
  }
  EditTask(obj:Task):Observable<Task>{
    return this.http.put<Task>(url+"tasks/"+obj.id,obj).pipe(map((res:Task)=>{
      return res;
    }))
  }
  EditTest(obj:Test):Observable<Test>{
    return this.http.put<Test>(url+"test/"+obj.id,obj).pipe(map((res:Test)=>{
      return res;
    }))
  }
  EditProject(obj:Project):Observable<Project>{
    return this.http.put<Project>(url+"projects/"+obj.id,obj).pipe(map((res:Project)=>{
      return res;
    }))
  }
  EditPatient(obj:Patient):Observable<Patient>{
    return this.http.put<Patient>(url+"patients/"+obj.id,obj).pipe(map((res:Patient)=>{
      return res;
    }))
  }
  EditTest_Collection(obj:Test_Collection):Observable<Test_Collection>{
    return this.http.put<Test_Collection>(url+"tests/"+obj.id,obj).pipe(map((res:Test_Collection)=>{
      return res;
    }))
  }
}
