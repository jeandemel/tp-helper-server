"use strict";
function socketMethod(event) {
    return function (target, key, descriptor) {
        console.log(target.getUser());
    };
}
exports.socketMethod = socketMethod;
