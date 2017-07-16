import { TP } from '../entities/tp';
import { User } from '../entities/user';
import { Help } from "../entities/help";
import { DaoHelp } from "../dao/dao-help";


export class UserSocket {
    protected dao: DaoHelp;

    constructor(public user: User, public socket: SocketIO.Socket) {
        this.dao = new DaoHelp();
        this.init();
    }

    protected init() {
        this.socket.on('tp-change', this.tpChange.bind(this));
        this.socket.on('help-request', this.helpRequest.bind(this));
        this.socket.on('help-success', this.helpSuccess.bind(this));
        this.socket.on('help-list', this.getHelpList.bind(this));

    }


    protected getHelpList() {
        this.dao.getAll().then((helps) => {
            this.socket.emit('help-list-response', {status:true, data:helps});
        }).catch((e) => this.socket.emit('help-list-response', { status: false, data: e.message }));;
    }

    protected tpChange(tp: TP) {

    }

    protected helpRequest(subject: string) {
        this.dao.getHelpByUser(this.user).then((result) => {
            if (result === null) {
                let help = new Help(subject, this.user, new Date().getTime());
                this.dao.add(help).then(() => {
                    this.diffuse('help-request-response', { status: true, data: help });
                }).catch((e) => this.socket.emit('help-request-response', { status: false, data: e.message }));
            } else {
                this.socket.emit('help-request-response', { status: false, data: 'vous avez déjà une demande d\'aide en cours' });
            }
        });
    }

    protected helpSuccess(help: Help) {
        this.dao.getHelpByUser(this.user).then((result) => {
            if (result._id == help._id) {

                this.dao.delete(help)
                    .then((success) => this.diffuse('help-success-response', { status: success, data: help }))
                    .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
            } else {
                this.socket.emit('help-success-response', { status: false, data: 'opération non autorisée' });
            }
        });
    }

    protected diffuse(event: string, data: object) {
        this.socket.emit(event, data);
        this.socket.broadcast.emit(event, data);

    }


}