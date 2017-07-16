"use strict";
class Step {
    constructor(description, stateUser = new Map()) {
        this.description = description;
        this.stateUser = stateUser;
    }
}
exports.Step = Step;
