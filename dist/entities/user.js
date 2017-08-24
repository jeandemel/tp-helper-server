"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(pseudo, email, pass, rights = 0, _id = undefined) {
        this.pseudo = pseudo;
        this.email = email;
        this.pass = pass;
        this.rights = rights;
        this._id = _id;
    }
}
exports.User = User;
