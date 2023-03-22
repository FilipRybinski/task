import { Component,OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Patient } from '../shared/patient.model';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms'
import { Store} from '../shared/store';
import { forkJoin } from 'rxjs';
declare var window: any;

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss']
})
export class ClientManagementComponent implements OnInit {
  Store:Store=Store.getInstance();
  p: number = 1;
  itemsPerPage:number=8;
  Data_Patients_Tmp!:Patient[];
  TypeOfSearch:string='Your Filter';
  input:string='';
  ModalAddPatients:any;
  AddPatientsForm!:FormGroup;
  EditFlag:boolean=false;
  EditObjectTmp!:Patient;
  constructor(private api:ApiService,private formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.GetData();
    this.ModalAddPatients = new window.bootstrap.Modal(document.getElementById("ModalAddPatients"));
    this.AddPatientsForm=this.formBuilder.group({
      first_name:['',[Validators.required]],
      last_name:['',[Validators.required]]
    })

  }
  get _input(){
    return this.input;
  }
  set _input(value:string){
    this.input=value;
    if(this.TypeOfSearch!=null){
      this.Data_Patients_Tmp=this.FilterData(this.TypeOfSearch);
    }
  }
  openModal(...rest:any) {
    rest[0].show();
    this.EditFlag=false;
    if(rest.length!=1){
      this.EditFlag=true;
      this.EditObjectTmp=rest[1];
      this.AddPatientsForm.patchValue({
        first_name:rest[1].first_name,
        last_name:rest[1].last_name,
      })
    }
  }
  closeModal(...rest:any) {
    rest[0].hide();
    this.AddPatientsForm.reset();
    
  }
  EditPatient(){
    let EditPatient:boolean=false;
    this.Store.StoreTasks.forEach(e=>{
      if(e.patient.id==this.EditObjectTmp.id){
        e.patient=new Patient(this.EditObjectTmp.id,this.AddPatientsForm.value.first_name,this.AddPatientsForm.value.last_name,this.EditObjectTmp.assigned_projects);
        this.api.EditTask(e).subscribe((res)=>{
          console.log(res);
        })
      }
    })
    this.api.EditPatient(new Patient(this.EditObjectTmp.id,this.AddPatientsForm.value.first_name,this.AddPatientsForm.value.last_name,this.EditObjectTmp.assigned_projects)).subscribe(()=>{
      this.ModalAddPatients.hide();
      this.AddPatientsForm.reset();
      this.GetData();
    })
  }
  SendDataPatientToDB(){
    this.api.AddPatient(new Patient(this.Store.StorePatients.length ===0 || NaN ? 1:this.Store.StorePatients[this.Store.StorePatients.length-1].id+1,this.AddPatientsForm.value.first_name,this.AddPatientsForm.value.last_name,[])).subscribe((res)=>{
      this.closeModal(this.ModalAddPatients);
      this.AddPatientsForm.reset();
      this.GetData();
    },(error)=>{
      console.log(error);
    })
  }

  DeletePatient(id:number){
    this.api.DeletePatient(id).subscribe(()=>{
      this.GetData();
    });
  }
  GetData(){
    forkJoin({
      Data_Patients: this.api.GetAllPatients(),
      Data_Projects: this.api.GetAllProjects(),
      Data_Tasks:this.api.GetAllTasks(),
    }).subscribe(res=>{
      this.Store.StorePatients=res.Data_Patients;
      this.Store.StoreProjects=res.Data_Projects;
      this.Store.StoreTasks=res.Data_Tasks;
      this.Data_Patients_Tmp=[...this.Store.StorePatients];
      console.log(res)},err=>{console.log(err)})
    
  }
  FilterData(input:string){
    let ConvertedInput:string=input.slice(6,input.length-3);
    switch(ConvertedInput){
      case 'id':
        return this.Store.StorePatients.filter(patient=>{
          return String(patient.id).includes(this.input);
        })
      case 'First Name':
        return this.Store.StorePatients.filter(patient=>{
          return patient.first_name.toLocaleLowerCase().includes(this.input.toLocaleLowerCase());
          
        });

      case 'Last Name':
        return this.Store.StorePatients.filter(patient=>{
          return patient.last_name.toLocaleLowerCase().includes(this.input.toLocaleLowerCase());
        })
      case 'Project Name':
        return this.Store.StorePatients.filter(projects=>{
            return projects.assigned_projects.some(project=>{
               return project.name.toLocaleLowerCase().includes(this.input.toLocaleLowerCase());
            })
          })
      default:
        return this.Store.StorePatients;
    }
  }
  key:string='id';
  reverse:boolean=false;
  sort(key:string){
    this.key=key;
    this.reverse=!this.reverse;
  }

}
