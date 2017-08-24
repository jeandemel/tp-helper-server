"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_dao_1 = require("./generic-dao");
class DaoHelp extends generic_dao_1.GenericDao {
    constructor() {
        super('helpRequest');
    }
    getHelpByUser(user) {
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.findOne({ 'user._id': user._id });
            return cursor.then((entity) => {
                this.conUtil.closeConnection();
                return entity;
            });
        });
    }
}
exports.DaoHelp = DaoHelp;
