const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const chatRoom = new Schema({
	name: String,
	chats: Array,
	color: String

});



module.exports = mongoose.model('chatRoom', chatRoom);