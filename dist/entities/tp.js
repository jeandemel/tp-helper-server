"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TP {
    constructor(label, steps = [], date = new Date(), active = true, _id = undefined) {
        this.label = label;
        this.steps = steps;
        this.date = date;
        this.active = active;
        this._id = _id;
    }
}
exports.TP = TP;
