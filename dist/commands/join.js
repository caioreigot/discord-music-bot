"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = void 0;
const index_1 = require("../index");
function join(msg) {
    (0, index_1.assignConnection)(msg);
}
exports.join = join;
