import { Patient } from "./patient.model";
import { Project } from "./project.model";
import { Test } from "./test";
import { Test_Collection } from "./test_collection";

export type TaskType={
    id:number
    tests:Test_Collection[];
    project:Project;
    patient:Patient
    status:boolean;
}


export class Task{
    public id:number
    public tests:Test_Collection[];
    public project:Project;
    public patient:Patient
    public status:boolean;
    constructor(id:number,tests:Test_Collection[],project:Project,patient:Patient,status:boolean){
        this.id=id;
        this.tests=tests;
        this.project=project;
        this.patient=patient;
        this.status=status;
    }
}