import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared/api.service';
import { Store } from './shared/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-task';
  Store=Store.getInstance();
  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.GetDataPatient();
  }
  GetDataPatient(){
    this.api.GetAllPatients().subscribe(res=>{
      this.Store.StorePatients=res;
    },err=>{
      console.log(err);
    })
  }

}
