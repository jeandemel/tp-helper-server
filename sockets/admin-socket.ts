import {DaoUser} from '../dao/dao-user';
import { TP } from '../entities/tp';
import { Help } from '../entities/help';


import { UserSocket } from "./user-socket";

export class AdminSocket extends UserSocket {
    private daoUser:DaoUser = new DaoUser();

    protected init() {
        super.init();
        this.socket.on('start-tp', this.startTp.bind(this));
        this.socket.on('modify-tp', this.modifyTp.bind(this));
        this.socket.on('user-list', this.getUsers.bind(this));
    }

    protected helpSuccess(help: Help) {
         this.dao.delete(help)
                    .then((success) => this.diffuseHelpList())
                    .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
    }

    protected startTp(tp: TP) {
        this.daoTp.add(tp)
            .then(() => {this.diffuseActiveTp(); this.diffuseActiveTpProgress()})
            .catch((e) => this.socket.emit('start-tp-response', { status: false, data: e.message }));
    }

    protected modifyTp(tp:TP) {
        this.daoTp.update(tp)
        .then(() => this.diffuseActiveTp())
        .catch((e) => this.socket.emit('modify-tp-response', { status: false, data: e.message }))
    }

    protected getUsers() {
        this.daoUser.getAll().then((users) => this.socket.emit('user-list-response', {status:true, data:users}))
        .catch((e) => this.socket.emit('user-list-response', { status: false, data: e.message }));
    }
}