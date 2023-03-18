import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Patient } from '../shared/patient.model';
import { Chart,registerables } from 'chart.js';
import { Project } from '../shared/project.model';
import { forkJoin } from 'rxjs';
Chart.register(...registerables);
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  Data_Patients!:Patient[];
  Data_Projects!:Project[];
  constructor(private api:ApiService) {}
  ngOnInit(): void {
    this.GetData();
  }
  GetData(){
    forkJoin({
      Data_Patients: this.api.GetAllPatients(),
      Data_Projects: this.api.GetAllProjects()
    }).subscribe(res=>{
      this.Data_Patients=res.Data_Patients;
      this.Data_Projects=res.Data_Projects;
      this.RenderChart(this.Data_Patients.length,this.Data_Projects.length);
      console.log(res)},err=>{console.log(err)})
    
  }
  RenderChart(amount_patients:number,amount_projects:number){
    new Chart("piechart", {
      type: 'bar',
      data: {
        labels: ['Patients','Projects'],
        datasets: [{
          label: 'Data',
          data: [amount_patients,amount_projects],
          borderWidth: 3,
          maxBarThickness:50,
          backgroundColor:[
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
