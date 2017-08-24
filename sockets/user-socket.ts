import { Step } from '../entities/step';
import { TP } from '../entities/tp';
import { User } from '../entities/user';
import { Help } from "../entities/help";
import { DaoHelp } from "../dao/dao-help";
import { DaoTp } from "../dao/dao-tp";
import { DaoTpProgress } from "../dao/dao-tp-progress";
import { TpProgress } from "../entities/tp-progress";


export class UserSocket {
    protected dao: DaoHelp;
    protected daoTp: DaoTp;
    protected daoProgress: DaoTpProgress;

    constructor(public user: User, public socket: SocketIO.Socket) {
        this.dao = new DaoHelp();
        this.daoTp = new DaoTp();
        this.daoProgress = new DaoTpProgress();
        this.init();
    }

    protected init() {

        this.socket.on('help-request', this.helpRequest.bind(this));
        this.socket.on('help-success', this.helpSuccess.bind(this));
        this.socket.on('help-list', this.getHelpList.bind(this));

        this.socket.on('active-tp', this.getActiveTp.bind(this));
        this.socket.on('change-progress', this.changeProgress.bind(this));

    }


    protected getActiveTp() {
        this.daoTp.getActiveTp().then((tp) => {
            this.socket.emit('active-tp-response', { status: true, data: tp });
            this.daoProgress.getProgressByTp(tp._id.toString()).then((progresses) => this.socket.emit('tp-progress-response', { status: true, data: progresses }));
        }).catch((e) => this.socket.emit('active-tp-response', { status: false, data: e.message }));;
    }


    protected getHelpList() {
        this.dao.getAll().then((helps) => {
            this.socket.emit('help-list-response', { status: true, data: helps });
        }).catch((e) => this.socket.emit('help-list-response', { status: false, data: e.message }));;
    }

    protected helpRequest(subject: string) {
        this.dao.getHelpByUser(this.user).then((result) => {
            if (result === null) {
                let help = new Help(subject, this.user, new Date().getTime());
                this.dao.add(help).then(() => {
                    this.diffuseHelpList();
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
                    .then((success) => this.diffuseHelpList())
                    .catch((e) => this.socket.emit('help-success-response', { status: false, data: e.message }));
            } else {
                this.socket.emit('help-success-response', { status: false, data: 'opération non autorisée' });
            }
        });
    }

    protected changeProgress(progress: TpProgress) {
        this.daoProgress.add(progress).then((success) => {
            this.diffuseActiveTpProgress();
        }).catch((e) => this.socket.emit('change-progress-response', { status: false, data: e.message }));
    }

    protected diffuse(event: string, data: object) {
        this.socket.emit(event, data);
        this.socket.broadcast.emit(event, data);

    }

    protected diffuseHelpList() {
        this.dao.getAll().then((helps) => {
            this.socket.emit('help-list-response', { status: true, data: helps });
            this.socket.broadcast.emit('help-list-response', { status: true, data: helps });
        });
    }

    protected diffuseActiveTp() {
        this.daoTp.getActiveTp().then((tp) => {
            this.socket.emit('active-tp-response', { status: true, data: tp });
            this.socket.broadcast.emit('active-tp-response', { status: true, data: tp });
        });
    }

    protected diffuseActiveTpProgress() {
        this.daoTp.getActiveTp().then((tp) => {
            this.daoProgress.getProgressByTp(tp._id).then((progresses) => {
                this.socket.emit('tp-progress-response', { status: true, data: progresses });
                this.socket.broadcast.emit('tp-progress-response', { status: true, data: progresses });
            })
        });
    }
}