"use strict";
const server_ws_1 = require('./server-ws');
const server = new server_ws_1.ServerWs();
server.run();
// const dao = new DaoUser();
// dao.getUserByLogin('test@test.com','test').then((trucs) => console.log(trucs));
// dao.update(new User('modif', 'modif@bloup.com', '1234',0,'5964e2ccbd30212fcbcec899')).then((id) => console.log(id));
// dao.add(new User('test', 'test', 'test')).then((id) => console.log(id));
// dao.getUserByLogin('ajout@mail.com', 'bloup').then((user) => console.log(user)); 