import { Patient } from "./patient.model";
import { Project } from "./project.model";
export class Store {
    public StoreProjects:Project[]=[];
    public StorePatients:Patient[]=[];
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