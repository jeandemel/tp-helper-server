"use strict";
const user_socket_1 = require("./user-socket");
class AdminSocket extends user_socket_1.UserSocket {
    helpSuccess(help) {
        this.dao.delete(help)
            .then((success) => this.diffuse('help-success-response', { status: success, data: help }))
            .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
    }
}
exports.AdminSocket = AdminSocket;
