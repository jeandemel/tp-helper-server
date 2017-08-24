"use strict";
const generic_dao_1 = require('./generic-dao');
class DaoTp extends generic_dao_1.GenericDao {
    constructor() {
        super('tp');
    }
    getActiveTp() {
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.findOne({ active: true });
            return cursor.then((tp) => {
                this.conUtil.closeConnection();
                return tp;
            });
        });
    }
}
exports.DaoTp = DaoTp;
