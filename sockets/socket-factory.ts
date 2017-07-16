import { User } from '../entities/user';
import { UserSocket } from "./user-socket";
import { AdminSocket } from "./admin-socket";


export class SocketFactory {

    public static buildSocket(user: User, socket: SocketIO.Socket): UserSocket {
        switch (user.rights) {
            case 0:
            default:
                return new UserSocket(user, socket);
            case 1:
                return new AdminSocket(user, socket);
        }

    }
}