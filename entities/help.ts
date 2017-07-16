import {User} from './user';

export class Help {
    constructor(public subject:string,public user:User, public timestamp:number, public _id?:string){}
}