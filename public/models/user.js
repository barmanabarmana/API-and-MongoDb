const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);
