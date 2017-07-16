
import { Step } from "./step";

export class TP {
    constructor(public label:string,
    public steps:Step[] = [],
    public date:Date = new Date(),
    public _id:string = undefined){}

    
}