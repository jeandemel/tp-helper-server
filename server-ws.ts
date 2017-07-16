import { DaoUser } from './dao/dao-user';
import * as io from 'socket.io';
import * as http from 'http';
import { UserSocket } from "./sockets/user-socket";
import { SocketFactory } from "./sockets/socket-factory";

export class ServerWs {
    private port: number = 3000;
    private server: http.Server;
    private ws: SocketIO.Server;
    private clients:UserSocket[];

    constructor() {
        this.server = http.createServer();
        this.ws = io(this.server);
        this.clients = [];
    }

    private init() {
        this.ws.on('connection', (socket) => {
            this.authenticate(socket).then((user) => {
                user.pass = '';
                socket.emit('authenticate', {status:true, data:user});
                let instance = SocketFactory.buildSocket(user, socket);
                this.clients.push(instance);

                socket.on('disconnect', () => {
                    this.clients = this.clients.filter((client) => client !== instance);
                    // console.log(this.clients);
                });
            }).catch((e) => {
                socket.emit('authenticate', {status:false, data:e.message});
                socket.disconnect();
            });


        });
    }

    private authenticate(socket) {
        let dao = new DaoUser();
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