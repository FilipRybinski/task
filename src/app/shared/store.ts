import { Patient } from "./patient.model";
import { Project } from "./project.model";
import { Task } from "./task";
import { Test } from "./test";
import { Test_Collection } from "./test_collection";
export class Store {
    public StoreProjects:Project[]=[];
    public StorePatients:Patient[]=[];
    public StoreTests:Test_Collection[]=[];
    public StoreTest:Test[]=[];
    public StoreTasks:Task[]=[];
    private static instance:Store;
    constructor(){
    }
    public static getInstance(): Store {
        if (!Store.instance) {
          Store.instance = new Store();
        }
        return Store.instance;
    }


}