import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { Patient,PatientType } from './patient.model';
import { Project,ProjectType } from './project.model';
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
  DeletePatient(id:number):Observable<Patient>{
    return this.http.delete<Patient>(url+"patients/"+id).pipe(map((res:Patient)=>{
      return res;
    }));
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
}
