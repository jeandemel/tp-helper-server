import { User } from './user';

import { Step } from "./step";

export class TP {
    constructor(public label: string,
        public steps: string[] = [],
        public date: Date = new Date(),
        public active: boolean = true,
        public _id: string = undefined) { }


}