import {MongoClient} from 'mongodb';
import * as crypto from 'crypto';

export class ConnectionUtil {
    private url = 'mongodb://localhost:27017/tp-helper';
    private db;

    constructor(private collName:string){}

    public getCollection(){
        return MongoClient.connect(this.url).then((db) => {
            this.db = db;
            return db.collection(this.collName);
        });
    } 

    public closeConnection() {
        if(this.db) {
            this.db.close();
        }
    }

    public encryption(pass:string, salt?:string):string {
        if(typeof(salt) === 'undefined') {
            salt = crypto.randomBytes(20).toString('hex').slice(0,10);
        }
        let encrypted = crypto.createHmac('sha512', salt);
        encrypted.update(pass);

        return salt+'€'+encrypted.digest('hex');
    }

    public compare(hash:string, pass:string) {
        let stored = hash.split('€');
        let test = this.encryption(pass, stored[0]);
        return hash === test;
    }
}