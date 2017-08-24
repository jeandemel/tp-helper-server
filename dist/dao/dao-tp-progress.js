"use strict";
const generic_dao_1 = require('./generic-dao');
class DaoTpProgress extends generic_dao_1.GenericDao {
    constructor() {
        super('tpProgress');
    }
    getProgressByTp(id) {
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.find({ tpId: id });
            return cursor.toArray().then((tpProgress) => {
                this.conUtil.closeConnection();
                return tpProgress;
            });
        });
    }
    getProgressByUser(id) {
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.find({ userId: id });
            return cursor.toArray().then((tpProgress) => {
                this.conUtil.closeConnection();
                return tpProgress;
            });
        });
    }
}
exports.DaoTpProgress = DaoTpProgress;
