"use strict";
const user_socket_1 = require("./user-socket");
const admin_socket_1 = require("./admin-socket");
class SocketFactory {
    static buildSocket(user, socket) {
        switch (user.rights) {
            case 0:
            default:
                return new user_socket_1.UserSocket(user, socket);
            case 1:
                return new admin_socket_1.AdminSocket(user, socket);
        }
    }
}
exports.SocketFactory = SocketFactory;
