"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_util_1 = require("./connection-util");
const bson_1 = require("bson");
class GenericDao {
    constructor(colName) {
        this.conUtil = new connection_util_1.ConnectionUtil(colName);
    }
    getAll() {
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.find();
            return cursor.toArray().then((entities) => {
                this.conUtil.closeConnection();
                return entities;
            });
        });
    }
    add(entity) {
        if (typeof (entity._id) !== 'undefined') {
            return this.update(entity);
        }
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.insertOne(entity);
            return cursor.then((optresult) => {
                this.conUtil.closeConnection();
                return true;
            });
        });
    }
    update(entity) {
        let modifEntity = this.entityTransform(entity);
        return this.conUtil.getCollection().then((collection) => {
            let cursor = collection.replaceOne({ _id: modifEntity._id }, modifEntity);
            return cursor.then((optresult) => {
                this.conUtil.closeConnection();
                if (optresult.modifiedCount === 1) {
                    return true;
                }
                return false;
            });
        });
    }
    delete(entity) {
        let modifEntity = this.entityTransform(entity);
        return this.conUtil.getCollection().then((collection) => {
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
    entityTransform(entity) {
        let modifEntity = Object.create(entity);
        if (typeof (entity._id) !== 'undefined') {
            modifEntity._id = new bson_1.ObjectId(modifEntity._id);
        }
        return modifEntity;
    }
}
exports.GenericDao = GenericDao;
