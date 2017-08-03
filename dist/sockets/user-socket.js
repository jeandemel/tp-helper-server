"use strict";
const help_1 = require("../entities/help");
const dao_help_1 = require("../dao/dao-help");
const dao_tp_1 = require("../dao/dao-tp");
const dao_tp_progress_1 = require("../dao/dao-tp-progress");
class UserSocket {
    constructor(user, socket) {
        this.user = user;
        this.socket = socket;
        this.dao = new dao_help_1.DaoHelp();
        this.daoTp = new dao_tp_1.DaoTp();
        this.daoProgress = new dao_tp_progress_1.DaoTpProgress();
        this.init();
    }
    init() {
        this.socket.on('help-request', this.helpRequest.bind(this));
        this.socket.on('help-success', this.helpSuccess.bind(this));
        this.socket.on('help-list', this.getHelpList.bind(this));
        this.socket.on('active-tp', this.getActiveTp.bind(this));
        this.socket.on('change-progress', this.changeProgress.bind(this));
    }
    getActiveTp() {
        this.daoTp.getActiveTp().then((tp) => {
            this.socket.emit('active-tp-response', { status: true, data: tp });
            this.daoProgress.getProgressByTp(tp._id.toString()).then((progresses) => this.socket.emit('tp-progress-response', { status: true, data: progresses }));
        }).catch((e) => this.socket.emit('active-tp-response', { status: false, data: e.message }));
        ;
    }
    getHelpList() {
        this.dao.getAll().then((helps) => {
            this.socket.emit('help-list-response', { status: true, data: helps });
        }).catch((e) => this.socket.emit('help-list-response', { status: false, data: e.message }));
        ;
    }
    helpRequest(subject) {
        this.dao.getHelpByUser(this.user).then((result) => {
            if (result === null) {
                let help = new help_1.Help(subject, this.user, new Date().getTime());
                this.dao.add(help).then(() => {
                    this.diffuseHelpList();
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
                    .then((success) => this.diffuseHelpList())
                    .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
            }
            else {
                this.socket.emit('help-success-response', { status: false, data: 'opération non autorisée' });
            }
        });
    }
    changeProgress(progress) {
        this.daoProgress.add(progress).then((success) => {
            this.diffuseActiveTpProgress();
        }).catch((e) => this.socket.emit('change-progress-response', { status: false, data: e.message }));
    }
    diffuse(event, data) {
        this.socket.emit(event, data);
        this.socket.broadcast.emit(event, data);
    }
    diffuseHelpList() {
        this.dao.getAll().then((helps) => {
            this.socket.emit('help-list-response', { status: true, data: helps });
            this.socket.broadcast.emit('help-list-response', { status: true, data: helps });
        });
    }
    diffuseActiveTp() {
        this.daoTp.getActiveTp().then((tp) => {
            this.socket.emit('active-tp-response', { status: true, data: tp });
            this.socket.broadcast.emit('active-tp-response', { status: true, data: tp });
        });
    }
    diffuseActiveTpProgress() {
        this.daoTp.getActiveTp().then((tp) => {
            this.daoProgress.getProgressByTp(tp._id).then((progresses) => {
                this.socket.emit('tp-progress-response', { status: true, data: progresses });
                this.socket.broadcast.emit('tp-progress-response', { status: true, data: progresses });
            });
        });
    }
}
exports.UserSocket = UserSocket;
