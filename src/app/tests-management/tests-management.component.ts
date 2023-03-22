import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, windowWhen } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { Store } from '../shared/store';
import { Task } from '../shared/task';
import { Test } from '../shared/test';
import { Test_Collection } from '../shared/test_collection';
declare var window: any;
@Component({
  selector: 'app-tests-management',
  templateUrl: './tests-management.component.html',
  styleUrls: ['./tests-management.component.scss']
})

export class TestsManagementComponent implements OnInit{
  p: number = 1;
  itemsPerPage:number=4;
  Store=Store.getInstance();
  ModalAddTest:any;
  ModalAddResult:any;
  ModalAddTests:any;
  AddTestForm!:FormGroup;
  AddResultForm!:FormGroup;
  AddTestsToCollection!:FormGroup;
  EditFlag:boolean=false;
  AddTestCollectionFlag:boolean=false;
  EditObjectTmp!:Test;
  TypeOfSearch!:Test_Collection;
  TypeOfSearch2!:Test;
  constructor(private api:ApiService,private formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.GetData();
    this.ModalAddResult=new window.bootstrap.Modal(document.getElementById('ModalAddResult'));
    this. ModalAddTest = new window.bootstrap.Modal(document.getElementById("ModalAddTest"));
    this.ModalAddTests=new window.bootstrap.Modal(document.getElementById('ModalAddTests'));
    this.AddTestForm=this.formBuilder.group({
      name:['',[Validators.required]],
    })
    this.AddResultForm=this.formBuilder.group({
      WhichTask:[{},Validators.required],
      WhichTask_Test:[{},Validators.required],
      TextArea:['',Validators.required]
    })
    this.AddTestsToCollection=this.formBuilder.group({
      Test_Collection_Name:[{},Validators.required],
      Test:[{},Validators.required]
    })

  }
  GetData(){
    forkJoin({
      Data_Patients: this.api.GetAllPatients(),
      Data_Projects: this.api.GetAllProjects(),
      Data_Tests: this.api.GetAllTest(),
      Data_Tests_Collection: this.api.GetAllTest_Collection(),
      Data_Tasks:this.api.GetAllTasks(),

    }).subscribe(res=>{
      this.Store.StorePatients=res.Data_Patients;
      this.Store.StoreProjects=res.Data_Projects;
      this.Store.StoreTest=res.Data_Tests
      this.Store.StoreTests=res.Data_Tests_Collection;
      this.Store.StoreTasks=res.Data_Tasks;
      console.log(res)},err=>{console.log(err)})
  }
  openModal(...rest:any) {
    rest[0].show();
    this.EditFlag=false;
    if(rest.length!=1){
      if(rest[1]=='Collection'){
        this.AddTestCollectionFlag=true;
      }else{
        this.AddTestCollectionFlag=false;
      }
      this.EditFlag=true;
      this.EditObjectTmp=rest[1];
      this.AddTestForm.patchValue({
        name:rest[1].name,
      })
    }
  }
  closeModal(...rest:any) {
    rest[0].hide();
    this.AddTestForm.reset();
  }
  DeleteTest(id:number){
    this.api.DeleteTest(id).subscribe(()=>{
      this.GetData();
    })
  }
  EditTest(){
    let tmpFlag:boolean=false
    this.Store.StoreTasks.forEach(e=>{
      e.tests.tests.forEach(z=>{
        if(this.EditObjectTmp.id==z.id){
          z.name=this.AddTestForm.value.name;
          tmpFlag=true;
        }
      })
      if(tmpFlag==true){
        this.api.EditTask(e).subscribe(res=>{
          console.log(res);
        })
        tmpFlag=false;
      }
    })
    this.Store.StoreTests.forEach(e=>{
      e.tests.forEach(z=>{
        if(z.id==this.EditObjectTmp.id){
          z.name=this.AddTestForm.value.name;
          tmpFlag=true;
        }
      })
      if(tmpFlag==true){
        this.api.EditTest_Collection(e).subscribe(res=>{
          console.log(res);
        })
        tmpFlag=false;
      }
    })
    this.api.EditTest(new Test(this.EditObjectTmp.id,this.AddTestForm.value.name,this.EditObjectTmp.result)).subscribe(()=>{
      this.ModalAddTest.hide();
      this.AddTestForm.reset();
      this.GetData();
    })
  }
  AddTestCollection(){
    this.api.AddTestCollection(new Test_Collection(this.Store.StoreTests.length ===0 || NaN ? 1:this.Store.StoreTests[this.Store.StoreTests.length-1].id+1,this.AddTestForm.value.name,[])).subscribe((res)=>{
      this.closeModal(this.ModalAddTest);
      this.AddTestForm.reset();
      this.GetData();
    },(error)=>{
      console.log(error);
    })
  }
  AddTestToTestCollection(obj:Test_Collection,obj2:Test){
    obj.tests.push(obj2);
    this.api.AddTestToTestCollection(obj).subscribe(()=>{
      this.AddTestsToCollection.reset();
      this.ModalAddTests.hide();
      this.GetData();
    })
  }
  AddTest(){
    this.api.AddTest(new Test(this.Store.StoreTest.length ===0 || NaN ? 1:this.Store.StoreTest[this.Store.StoreTest.length-1].id+1,this.AddTestForm.value.name,'')).subscribe((res)=>{
      this.closeModal(this.ModalAddTest);
      this.AddTestForm.reset();
      this.GetData();
    },(error)=>{
      console.log(error);
    })
  }
  DeleteTestCollection(id:number){
    this.api.DeleteTests(id).subscribe(()=>{
      this.GetData();
    })
  }
  UnassignedProjects(test_collection:Test_Collection,tests:Test[]):Test[]{
    let tmp:Test[]=[]
    try{
      tmp = tests.filter(e=>{
        return !JSON.stringify(test_collection.tests).includes(JSON.stringify(e));
      });
    }catch{
    }
    return tmp;
  }
  AddResult(obj:Task,obj2:Test){
    obj.tests.tests.find(e=>{
      if(JSON.stringify(e)==JSON.stringify(obj2)){
        console.log('essa');
        e.result=this.AddResultForm.value.TextArea;
      }
    })
    this.api.EditTask(obj).subscribe((res)=>{
      console.log(res);
    })
    this.AddResultForm.reset();
    this.ModalAddResult.hide();
    console.log(obj,obj2);
  }
  key:string='id';
  reverse:boolean=false;
  sort(key:string){
    this.key=key;
    this.reverse=!this.reverse;
  }
}
