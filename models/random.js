const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Random = new Schema({
    color: String,
    size: Number
});


module.exports = mongoose.model('randoms', Random);
