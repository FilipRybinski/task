import {Project} from "./project.model";
export type PatientType={
    id:number;
    first_name:string;
    last_name:string;
    assigned_projects:[];
}


export class Patient{
    public id:number;
    public first_name:string;
    public last_name:string;
    public assigned_projects:any[];

    public constructor (id:number,first_name:string,last_name:string,assigned_projects:any[]){
        this.id=id;
        this.first_name=first_name;
        this.last_name=last_name;
        this.assigned_projects=assigned_projects;
    }
}