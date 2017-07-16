"use strict";
exports.__esModule = true;
var User = (function () {
    function User(uid, pseudo, email, pass, rigts) {
        if (rigts === void 0) { rigts = 0; }
        this.uid = uid;
        this.pseudo = pseudo;
        this.email = email;
        this.pass = pass;
        this.rigts = rigts;
    }
    return User;
}());
exports.User = User;
