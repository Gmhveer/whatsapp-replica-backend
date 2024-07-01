const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let userSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }
}, { timestamps: true });
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);