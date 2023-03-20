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
  Data_Patients_Tmp!:Patient[];
  TypeOfSearch:string='Your Filter';
  TypeOfSearch2:string='';
  input:string='';
  ModalAddProjects:any;
  ModalAssign:any;
  AddProjectForm!:FormGroup;
  EditFlag:boolean=false;
  EditObjectTmp!:Project;
  EditFlag2:boolean=false;
  constructor(private api:ApiService,private formBuilder:FormBuilder){
  }
  ngOnInit(): void {
    this.GetData();
    this. ModalAddProjects = new window.bootstrap.Modal(document.getElementById("ModalAddProjects"));
    this. ModalAssign = new window.bootstrap.Modal(document.getElementById("ModalAssign"));
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
  get _TypeOfSearch2(){
    return this.TypeOfSearch2;
  }
  set _TypeOfSearch2(value:string){
    this.TypeOfSearch2=value;
    if(this.TypeOfSearch2!=''){
      this.Data_Patients_Tmp=this.Store.StorePatients.filter(project=>{return project.assigned_projects.some(name_project=>name_project.name==this.TypeOfSearch2)});
      this.EditFlag2=true;
    }else{
      this.Data_Patients_Tmp=this.Store.StorePatients;
    }
  }
  Agreement(patient:Patient,TypeOfSearch2:string){
      patient.assigned_projects.forEach(e=>{
        if(e.name==TypeOfSearch2){
          e.access=true;
        }
      })
      this.api.EditPatient(patient).subscribe(()=>{
        this.GetData();
      })
      
  }
  Disagreement(patient:Patient,TypeOfSearch2:string){
    patient.assigned_projects.forEach(e=>{
      if(e.name==TypeOfSearch2){
        e.access=false;
      }
    })
    this.api.EditPatient(patient).subscribe(()=>{
      this.GetData();
    })
    
  }
  Assign(patient:Patient,project:string){
    let tmp!:any;
    this.Store.StoreProjects.forEach(e=>{if(e.name==project){
      tmp=e;
    }})
    tmp["access"]=false;
    patient.assigned_projects.push(tmp);
    this.api.EditPatient(patient).subscribe(()=>{
      this.GetData();
    })
  }
  Unassign(patient:Patient,project:string){
    let tmp!:number;
    patient.assigned_projects.forEach((e,index)=>{if(e.name==project){
      tmp=index;
    }})
    patient.assigned_projects.splice(tmp,1);
    this.api.EditPatient(patient).subscribe(()=>{
      this.GetData();
    })
  }
  EditProject(){
    this.api.EditProject(new Project(this.EditObjectTmp.id,this.AddProjectForm.value.name_project,this.AddProjectForm.value.description)).subscribe(()=>{
      this.ModalAddProjects.hide();
      this.GetData();
    })
  }
  DeleteProject(id:number){
    ///////////DODAĆ USUWANIE Z PACJENTOW TEGO PROJEKTU /////////
    this.api.DeleteProject(id).subscribe(()=>{
      this.GetData();
    })
  }
  SendDataProjectToDB(){
    this.api.AddProject(new Project(this.Store.StoreProjects.length ===0 || NaN ? 1:this.Store.StoreProjects[this.Store.StoreProjects.length-1].id+1,this.AddProjectForm.value.name_project,this.AddProjectForm.value.description)).subscribe((res)=>{
      this.closeModal(this.ModalAddProjects);
      this.AddProjectForm.reset();
      this.GetData();
    },(error)=>{
      console.log(error);
    })
  }
  openModal(...rest:any) {
    if(rest[0]==this.ModalAssign) this.Data_Patients_Tmp=this.Store.StorePatients;
    rest[0].show();
    this.EditFlag=false;
    if(rest.length!=1){
      this.EditFlag=true;
      this.EditObjectTmp=rest[1];
      this.AddProjectForm.patchValue({
        name_project:rest[1].name,
        description:rest[1].description
      })
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
  UnassignedProjects(projects:Project[],patient:Patient):Project[]{
    let tmp:Project[]=[];
    patient.assigned_projects.forEach(e=>{
      projects.some(z=>{
        if(z.name==e.name){
          tmp.push(z);
        }
      })
    })
    return projects.filter(e=>{
      return !tmp.includes(e)
    });
  }
  DataHelper(array:any[]):any[]{
    let tmp:any[];
    if(this.TypeOfSearch2!=''){
      tmp=array.filter(e=>{return e.name==this.TypeOfSearch2})
    }else{
      tmp=array;
    }
    return tmp;
  }
  check(obj:Patient,name_project:string):boolean{
    let tmp:boolean=false;
    obj.assigned_projects.some(e=>{if(e.name==name_project){
      tmp=e.access;
    }
    })
    return tmp;
  }
  key:string='id';
  reverse:boolean=false;
  sort(key:string){
    this.key=key;
    this.reverse=!this.reverse;
  }
}
