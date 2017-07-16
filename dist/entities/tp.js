"use strict";
class TP {
    constructor(label, steps = [], date = new Date(), _id = undefined) {
        this.label = label;
        this.steps = steps;
        this.date = date;
        this._id = _id;
    }
}
exports.TP = TP;
