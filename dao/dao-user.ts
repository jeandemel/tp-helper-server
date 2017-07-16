import {GenericDao} from './generic-dao';

import { ConnectionUtil } from "./connection-util";
import { Collection } from "mongodb";
import { User } from "../entities/user";
import { ObjectId } from "bson";

export class DaoUser extends GenericDao<User> {
    
    constructor(){
        super('user');
    }

    getUserByLogin(mail: string, pass: string): Promise<User> {
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.findOne({ email: mail });
            return cursor.then((user) => {
                this.conUtil.closeConnection();
                if(user != null && this.conUtil.compare(user.pass, pass)){
                    return user;
                }
                return null;

            });

        });
    }

    add(entity: User): Promise<string> {
        entity.pass = this.conUtil.encryption(entity.pass);
        return super.add(entity);
    }

}