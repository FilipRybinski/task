import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { Patient } from '../shared/patient.model';
import { Project } from '../shared/project.model';
import { Store } from '../shared/store';
declare var window: any;

@Component({
  selector: 'app-projects-management',
  templateUrl: './projects-management.component.html',
  styleUrls: ['./projects-management.component.scss']
})
export class ProjectsManagementComponent implements OnInit {
  p: number = 1;
  itemsPerPage:number=8;
  Store=Store.getInstance();
  Data_Projects_Tmp!:Project[];
  TypeOfSearch:string='Your Filter';
  input:string='';
  ModalAddProjects:any;
  ModalEditProjects:any;
  AddProjectForm!:FormGroup;
  constructor(private api:ApiService,private formBuilder:FormBuilder){
  }
  ngOnInit(): void {
    this.GetData();
    this. ModalAddProjects = new window.bootstrap.Modal(document.getElementById("ModalAddProjects"));
    this.AddProjectForm=this.formBuilder.group({
      name_project:['',[Validators.required]],
      description:['',[Validators.required]]
    })
  }
  get _input(){
    return this.input;
  }
  set _input(value:string){
    this.input=value;
    if(this.TypeOfSearch!=null){
      this.Data_Projects_Tmp=this.FilterData(this.TypeOfSearch);
    }
  }
  SendDataPatientToDB(){
    this.api.AddProject(new Project(this.Store.StorePatients.length ===0 || NaN ? 1:this.Store.StorePatients[this.Store.StorePatients.length-1].id+1,this.AddProjectForm.value.name_project,this.AddProjectForm.value.description)).subscribe((res)=>{
      this.closeModal(this.ModalAddProjects);
      this.AddProjectForm.reset();
      this.GetData();
    },(error)=>{
      console.log(error);
    })
  }
  openModal(...rest:any) {
    rest[0].show();
    if(rest.length!=1){
  
    }
  }
  closeModal(...rest:any) {
    rest[0].hide();
  }
  GetData(){
    forkJoin({
      Data_Patients: this.api.GetAllPatients(),
      Data_Projects: this.api.GetAllProjects()
    }).subscribe(res=>{
      this.Store.StorePatients=res.Data_Patients;
      this.Store.StoreProjects=res.Data_Projects;
      this.Data_Projects_Tmp=this.Store.StoreProjects;
      console.log(res)},err=>{console.log(err)})
    
  }
  FilterData(input:string){
    let ConvertedInput:string=input.slice(6,input.length-3);
    switch(ConvertedInput){
      case 'id':
        return this.Store.StoreProjects.filter(project=>{
          return String(project.id).includes(this.input);
        })
      case 'Name':
        return this.Store.StoreProjects.filter(project=>{
          console.log(project.name.includes(this.input));
          return project.name.toLocaleLowerCase().includes(this.input.toLocaleLowerCase());
          
        });
      case 'Description':
          return this.Store.StoreProjects.filter(project=>{
            return project.description.toLocaleLowerCase().includes(this.input.toLocaleLowerCase());
            
        });
      case 'Amount':
        return this.Store.StoreProjects.filter(project_name_compare=>{
          return (this.Store.StorePatients.filter(project=>{return project.assigned_projects.some(name_project=>name_project.name==project_name_compare.name)}).length >= Number(this.input))
          
        })
      default:
        return this.Store.StoreProjects;
    }
  }
  AmountDisplay(name:string){
    return this.Store.StorePatients.filter(project=>{return project.assigned_projects.some(name_project=>name_project.name==name)}).length
  }

  
}
