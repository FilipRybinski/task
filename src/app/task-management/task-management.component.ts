import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { Patient } from '../shared/patient.model';
import { Project } from '../shared/project.model';
import { Store } from '../shared/store';
import { Task } from '../shared/task';
import { Test_Collection } from '../shared/test_collection';
declare var window: any;
@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit{
  p: number = 1;
  itemsPerPage:number=6;
  Store=Store.getInstance();
  ModalAddTask:any;
  AddTaskForm!:FormGroup;
  EditFlag:boolean=false;
  EditObjectTmp!:Task;
  TypeOfSearch:string='Your Filter';
  TypeOfSearch2:string='';
  input:string='';
  Data_Tasks_Tmp!:Task[];
  lowest_date!:string;
  constructor(private api:ApiService,private formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.GetData();
    this.ModalAddTask=new window.bootstrap.Modal(document.getElementById('ModalAddTask'));
    this.AddTaskForm=this.formBuilder.group({
      WhichPatient:[undefined,Validators.required],
      WhichProject:[undefined,Validators.required],
      WhichTests:[undefined,Validators.required]
    })
  }
  
  get _input(){
    return this.input;
  }
  set _input(value:string){
    this.input=value;
    if(this.TypeOfSearch!=null){
      this.Data_Tasks_Tmp=this.FilterData(this.TypeOfSearch);
    }
  }
  openModal(...rest:any) {
    rest[0].show();
    this.EditFlag=false;
    if(rest.length!=1){
      this.EditFlag=true;
      this.EditObjectTmp=rest[1];
    }
  }

  closeModal(...rest:any) {
    rest[0].hide();
    this.AddTaskForm.reset();
  }
  DeleteTask(obj:Task){
    this.api.DeleteTask(obj.id).subscribe((res)=>{
      this.GetData();
    })

  }
  EditTask_Status(obj:Task){
    obj.status=true;
    this.api.EditTask(obj).subscribe(()=>{
      this.GetData();
    })
  }
  EditTask(){
    delete this.AddTaskForm.value.WhichPatient['assigned_projects'];
    this.api.EditTask(new Task(this.EditObjectTmp.id,this.AddTaskForm.value.WhichTests,this.AddTaskForm.value.WhichProject,this.AddTaskForm.value.WhichPatient,this.EditObjectTmp.status,this.EditObjectTmp.date)).subscribe(()=>{
      this.ModalAddTask.hide();
      this.AddTaskForm.reset();
      this.GetData();
    })
  }
  AddTask(){
    delete this.AddTaskForm.value.WhichPatient['assigned_projects'];
    this.api.AddTask(new Task(this.Store.StoreTasks.length ===0 || NaN ? 1:this.Store.StoreTasks[this.Store.StoreTasks.length-1].id+1,this.AddTaskForm.value.WhichTests,this.AddTaskForm.value.WhichProject,this.AddTaskForm.value.WhichPatient,false,new Date())).subscribe(()=>{
      this.ModalAddTask.hide();
      this.AddTaskForm.reset();
      this.GetData();
    })
  }
  GetData(){
    forkJoin({
      Data_Patients: this.api.GetAllPatients(),
      Data_Tasks:this.api.GetAllTasks(),
      Data_Test_Collection:this.api.GetAllTest_Collection()
    }).subscribe(res=>{
      this.Store.StorePatients=res.Data_Patients;
      this.Store.StoreTasks=res.Data_Tasks;
      this.Store.StoreTests=res.Data_Test_Collection;
      this.Data_Tasks_Tmp=this.Store.StoreTasks;
      this.lowest_date=this.TakeLowestDate();
      console.log(res)},err=>{console.log(err)})
    
  }
  TakeLowestDate(){
    let tmp2:Task[];
    if(this.Store.StoreTasks.length!=0){
      tmp2=this.Store.StoreTasks.sort((a,b)=>{
        var c= new Date(a.date).getTime();
        var d= new Date(b.date).getTime();
        return c-d;
      })
    }
    return new Date().toISOString().split('T')[0];
  }
  FilterData(input:string){
    let ConvertedInput:string=input.slice(6,input.length-3);
    switch(ConvertedInput){
      case 'Date':
        return this.Store.StoreTasks.filter(Project=>{
          return new Date(Project.date).getTime() > new Date(this.input).getTime();
        });
      case 'Project Name':
        console.log('essa');
        return this.Store.StoreTasks.filter(Project=>{
          return Project.project.name.toLocaleLowerCase().includes(this.input.toLocaleLowerCase());  
        });
      default:
        return this.Store.StoreTasks;
    }
  }
  key:string='id';
  reverse:boolean=false;
  sort(key:string){
    this.key=key;
    this.reverse=!this.reverse;
  }
}
