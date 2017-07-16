import {User} from '../entities/user';
import {GenericDao} from './generic-dao';
import { Help } from "../entities/help";
import { Collection } from "mongodb";


export class DaoHelp extends GenericDao<Help> {

    constructor() {
        super('helpRequest');
    }

    getHelpByUser(user:User):Promise<Help> {
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.findOne({'user._id':user._id});
            return cursor.then((entity) => {
                this.conUtil.closeConnection();
                return entity;

            });

        });
    }
}