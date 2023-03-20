import { Test } from "./test";

export type Test_CollectionType={
    id:number
    name:string;
    tests:Test[];
}
export class Test_Collection{
    public id:number
    public name:string;
    public tests:Test[];
    constructor(id:number,name:string,tests:Test[]){
        this.id=id;
        this.name=name;
        this.tests=tests;
    }
}