"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_dao_1 = require("./generic-dao");
class DaoUser extends generic_dao_1.GenericDao {
    constructor() {
        super('user');
    }
    getUserByLogin(mail, pass) {
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.findOne({ email: mail });
            return cursor.then((user) => {
                this.conUtil.closeConnection();
                if (user != null && this.conUtil.compare(user.pass, pass)) {
                    return user;
                }
                return null;
            });
        });
    }
    add(entity) {
        entity.pass = this.conUtil.encryption(entity.pass);
        return super.add(entity);
    }
}
exports.DaoUser = DaoUser;
