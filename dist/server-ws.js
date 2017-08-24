"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dao_user_1 = require("./dao/dao-user");
const io = require("socket.io");
const http = require("http");
const socket_factory_1 = require("./sockets/socket-factory");
class ServerWs {
    constructor() {
        this.port = 3000;
        this.server = http.createServer();
        this.ws = io(this.server);
        this.clients = [];
    }
    init() {
        this.ws.on('connection', (socket) => {
            this.authenticate(socket).then((user) => {
                user.pass = '';
                socket.emit('authenticate', { status: true, data: user });
                let instance = socket_factory_1.SocketFactory.buildSocket(user, socket);
                this.clients.push(instance);
                socket.on('disconnect', () => {
                    this.clients = this.clients.filter((client) => client !== instance);
                    // console.log(this.clients);
                });
            }).catch((e) => {
                socket.emit('authenticate', { status: false, data: e.message });
                socket.disconnect();
            });
        });
    }
    authenticate(socket) {
        let dao = new dao_user_1.DaoUser();
        return dao.getUserByLogin(socket.handshake.query.mail, socket.handshake.query.pass).then((user) => {
            if (user === null) {
                throw new Error('erreur de logins');
            }
            return user;
        });
    }
    run() {
        this.init();
        this.server.listen(this.port, () => {
            console.log('Socket server listening on port ' + this.port);
        });
    }
}
exports.ServerWs = ServerWs;
