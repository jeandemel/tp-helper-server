import {TP} from '../entities/tp';
import {GenericDao} from './generic-dao';
import { Collection } from "mongodb";
import { ObjectId } from "bson";



export class DaoTp extends GenericDao<TP> {
    constructor(){
        super('tp');
    }

    public getActiveTp(): Promise<TP> {
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.findOne({ active:true  });
            return cursor.then((tp) => {
                this.conUtil.closeConnection();
                
                return tp;

            });

        });
    }
}