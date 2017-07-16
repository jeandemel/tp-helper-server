

import { ConnectionUtil } from "./connection-util";
import { Collection } from "mongodb";
import { ObjectId } from "bson";

export class GenericDao<T> {
    protected conUtil: ConnectionUtil;

    constructor(colName: string) {
        this.conUtil = new ConnectionUtil(colName);
    }

    getAll(): Promise<T[]> {
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.find();
            return cursor.toArray().then((entities) => {
                this.conUtil.closeConnection();
                return entities;

            });

        });
    }
    add(entity: T): Promise<string> {
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.insertOne(entity);
            return cursor.then((optresult) => {
                this.conUtil.closeConnection();
                return optresult.insertedId.toHexString();

            });

        });
    }
    update(entity: T): Promise<boolean> {
        let modifEntity = Object.create(<any>entity);
        modifEntity._id = new ObjectId(modifEntity._id);
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.replaceOne({ _id: modifEntity._id }, modifEntity);
            return cursor.then((optresult) => {
                this.conUtil.closeConnection();
                if (optresult.modifiedCount === 1) {
                    console.log(entity);
                    return true;
                }
                return false;

            });

        });
    }
    delete(entity: T): Promise<boolean> {
        let modifEntity = Object.create(<any>entity);
        modifEntity._id = new ObjectId(modifEntity._id);
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.deleteOne({ _id: modifEntity._id });
            return cursor.then((optresult) => {
                this.conUtil.closeConnection();
                if (optresult.deletedCount === 1) {
                    
                    return true;
                }
                return false;

            });

        });
    }

}