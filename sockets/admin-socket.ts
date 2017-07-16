import {Help} from '../entities/help';


import { UserSocket } from "./user-socket";

export class AdminSocket extends UserSocket {


    protected helpSuccess(help: Help) {
                this.dao.delete(help)
                    .then((success) => this.diffuse('help-success-response', { status: success, data: help }))
                    .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
    }
}