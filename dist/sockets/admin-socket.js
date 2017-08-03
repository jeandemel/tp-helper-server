"use strict";
const dao_user_1 = require('../dao/dao-user');
const user_socket_1 = require("./user-socket");
class AdminSocket extends user_socket_1.UserSocket {
    constructor() {
        super(...arguments);
        this.daoUser = new dao_user_1.DaoUser();
    }
    init() {
        super.init();
        this.socket.on('start-tp', this.startTp.bind(this));
        this.socket.on('modify-tp', this.modifyTp.bind(this));
        this.socket.on('user-list', this.getUsers.bind(this));
    }
    helpSuccess(help) {
        this.dao.delete(help)
            .then((success) => this.diffuseHelpList())
            .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
    }
    startTp(tp) {
        this.daoTp.add(tp)
            .then(() => { this.diffuseActiveTp(); this.diffuseActiveTpProgress(); })
            .catch((e) => this.socket.emit('start-tp-response', { status: false, data: e.message }));
    }
    modifyTp(tp) {
        this.daoTp.update(tp)
            .then(() => this.diffuseActiveTp())
            .catch((e) => this.socket.emit('modify-tp-response', { status: false, data: e.message }));
    }
    getUsers() {
        this.daoUser.getAll().then((users) => this.socket.emit('user-list-response', { status: true, data: users }))
            .catch((e) => this.socket.emit('user-list-response', { status: false, data: e.message }));
    }
}
exports.AdminSocket = AdminSocket;
