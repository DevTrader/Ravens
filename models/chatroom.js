const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const chatRoom = new Schema({
	name: String,
	chats: Array

});



module.exports = mongoose.model('chatRoom', chatRoom);