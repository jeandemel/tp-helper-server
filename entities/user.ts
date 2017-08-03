export class User {


    constructor(public pseudo: string,
        public email: string,
        public pass: string,
        public rights: number = 0,
        public progress: Progress[],
        public _id: string = undefined) {
    }

}

export interface Progress {
    step:string;
    state:number;
}