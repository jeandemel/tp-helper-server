"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const help_1 = require("../entities/help");
const dao_help_1 = require("../dao/dao-help");
class UserSocket {
    constructor(user, socket) {
        this.user = user;
        this.socket = socket;
        this.dao = new dao_help_1.DaoHelp();
        this.init();
    }
    init() {
        this.socket.on('tp-change', this.tpChange.bind(this));
        this.socket.on('help-request', this.helpRequest.bind(this));
        this.socket.on('help-success', this.helpSuccess.bind(this));
        this.socket.on('help-list', this.getHelpList.bind(this));
    }
    getHelpList() {
        this.dao.getAll().then((helps) => {
            this.socket.emit('help-list-response', { status: true, data: helps });
        }).catch((e) => this.socket.emit('help-list-response', { status: false, data: e.message }));
        ;
    }
    tpChange(tp) {
    }
    helpRequest(subject) {
        this.dao.getHelpByUser(this.user).then((result) => {
            if (result === null) {
                let help = new help_1.Help(subject, this.user, new Date().getTime());
                this.dao.add(help).then(() => {
                    this.diffuse('help-request-response', { status: true, data: help });
                }).catch((e) => this.socket.emit('help-request-response', { status: false, data: e.message }));
            }
            else {
                this.socket.emit('help-request-response', { status: false, data: 'vous avez déjà une demande d\'aide en cours' });
            }
        });
    }
    helpSuccess(help) {
        this.dao.getHelpByUser(this.user).then((result) => {
            if (result._id == help._id) {
                this.dao.delete(help)
                    .then((success) => this.diffuse('help-success-response', { status: success, data: help }))
                    .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
            }
            else {
                this.socket.emit('help-success-response', { status: false, data: 'opération non autorisée' });
            }
        });
    }
    diffuse(event, data) {
        this.socket.emit(event, data);
        this.socket.broadcast.emit(event, data);
    }
}
exports.UserSocket = UserSocket;
