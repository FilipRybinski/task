import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Patient } from '../shared/patient.model';
import { Chart,registerables } from 'chart.js';
import { Project } from '../shared/project.model';
import { forkJoin } from 'rxjs';
import { Store } from '../shared/store';
Chart.register(...registerables);
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  Store=Store.getInstance();
  constructor(private api:ApiService) {}
  ngOnInit(): void {
    this.GetData();
  }
  GetData(){
    forkJoin({
      Data_Patients: this.api.GetAllPatients(),
      Data_Projects: this.api.GetAllProjects(),
      Data_Tests: this.api.GetAllTest(),
      Data_Tests_Collection: this.api.GetAllTest_Collection()
    }).subscribe(res=>{
      this.Store.StorePatients=res.Data_Patients;
      this.Store.StoreProjects=res.Data_Projects;
      this.Store.StoreTest=res.Data_Tests
      this.Store.StoreTests=res.Data_Tests_Collection;
      this.RenderChart(this.Store.StorePatients.length,this.Store.StoreProjects.length,this.Store.StoreTest.length,this.Store.StoreTests.length);
      console.log(res)},err=>{console.log(err)})
    
  }
  RenderChart(amount_patients:number,amount_projects:number,amount_test:number,amount_test_collection:number){
    new Chart("piechart", {
      type: 'bar',
      data: {
        labels: ['Patients','Projects','Test','Test Collection'],
        datasets: [{
          label: 'Data',
          data: [amount_patients,amount_projects,amount_test,amount_test_collection],
          borderWidth: 3,
          maxBarThickness:50,
          backgroundColor:[
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ]
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }

}
