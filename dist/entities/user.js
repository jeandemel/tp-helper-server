"use strict";
class User {
    constructor(pseudo, email, pass, rights = 0, progress, _id = undefined) {
        this.pseudo = pseudo;
        this.email = email;
        this.pass = pass;
        this.rights = rights;
        this.progress = progress;
        this._id = _id;
    }
}
exports.User = User;
