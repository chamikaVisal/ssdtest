var mongoose = require('mongoose');
const schema = mongoose.Schema;

const FBuserSchema = new schema({
    uid: {
        type: String,
        required: true
    },
    token: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        // required: true
    },
    pic: {
        type: String,
        required: true
    },
 

})
module.exports = FBUsers = mongoose.model('FBusers', FBuserSchema)