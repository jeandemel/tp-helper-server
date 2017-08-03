import { GenericDao } from './generic-dao';



import { TpProgress } from "../entities/tp-progress";
import { Collection } from "mongodb";

export class DaoTpProgress extends GenericDao<TpProgress> {

    constructor() {
        super('tpProgress');
    }

    getProgressByTp(id: string): Promise<TpProgress[]> {
        return this.conUtil.getCollection().then((collection: Collection) => {

            let cursor = collection.find({ tpId: id });

            return cursor.toArray().then((tpProgress) => {
                this.conUtil.closeConnection();

                return tpProgress;

            });

        });
    }

    getProgressByUser(id: string): Promise<TpProgress[]> {
        return this.conUtil.getCollection().then((collection: Collection) => {
            let cursor = collection.find({ userId: id });
            return cursor.toArray().then((tpProgress) => {
                this.conUtil.closeConnection();

                return tpProgress;

            });

        });
    }

}