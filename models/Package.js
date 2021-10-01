var mongoose = require('mongoose');
const schema = mongoose.Schema;

const packageSchema = new schema({
    packageName: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },


})
module.exports = Package = mongoose.model('packages', packageSchema)