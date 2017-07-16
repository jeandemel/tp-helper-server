
import { User } from "./user";

export class Step {

    constructor(public description:string,
    public stateUser:Map<User,number> = new Map<User,number>()){
        
    }
}