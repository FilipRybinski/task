export type TestType={
    id:number
    name:string;
    result:string;
}
export class Test{
    public id:number
    public name:string;
    public result:string;
    constructor(id:number,name:string,result:string){
        this.id=id;
        this.name=name;
        this.result=result;
    }
}