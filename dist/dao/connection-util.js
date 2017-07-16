"use strict";
const mongodb_1 = require('mongodb');
const crypto = require('crypto');
class ConnectionUtil {
    constructor(collName) {
        this.collName = collName;
        this.url = 'mongodb://localhost:27017/tp-helper';
    }
    getCollection() {
        return mongodb_1.MongoClient.connect(this.url).then((db) => {
            this.db = db;
            return db.collection(this.collName);
        });
    }
    closeConnection() {
        if (this.db) {
            this.db.close();
        }
    }
    encryption(pass, salt) {
        if (typeof (salt) === 'undefined') {
            salt = crypto.randomBytes(20).toString('hex').slice(0, 10);
        }
        let encrypted = crypto.createHmac('sha512', salt);
        encrypted.update(pass);
        return salt + '€' + encrypted.digest('hex');
    }
    compare(hash, pass) {
        let stored = hash.split('€');
        let test = this.encryption(pass, stored[0]);
        return hash === test;
    }
}
exports.ConnectionUtil = ConnectionUtil;
