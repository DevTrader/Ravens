const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Random = require('../models/random');
const chatRoom = require('../models/chatroom');

const router = express.Router();

//Render Landing Page
router.get('/', (req, res) => {
    res.render('home');
    //response.sendFile(__dirname + '/public/index.html');
});

// Create Room 
router.post('/createRoom', (req, res) => {

    console.log('Create Room');
    let chatColor = randomEl(adjectives);
    var n = new chatRoom();
    n.color = chatColor;
    n.name = chatColor+' '+randomEl(nouns)+' Room';
    n.save(function(err,room) {
        console.log(room.id);
        res.send({redirect:`/room/${room.id}`}); 
    });
});

//Render Room With Unique ID
router.get('/room/:id', (req, res) => {
    console.log(req.params);
    chatRoom
        .findOne({_id: req.params.id})
        .exec()
        .then(room => {
            console.log(room);
            res.render('chatroom', {room:room});
        })
        .catch(err =>{throw err});

});

//Populate Browse Page with Existing Rooms
router.get('/browse', (req, res) => {
    chatRoom
        .find()
        .exec()
        .then(rooms => {
            console.log(rooms);
            res.render('browse', {rooms:rooms});
        })
        .catch(err =>{throw err});

})

router.get('/circles', (req, res) => {
    chatRoom
        .find()
        .exec()
        .then(rooms => {
            console.log(rooms);
            res.render('circles', {data: rooms});
        })
        .catch(err =>{throw err});

})

//Name Randomizer
function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

var adjectives = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
var nouns = ["Ninja", "Chair", "Pancake", "Statue", "Unicorn", "Rainbows", "Laser", "Senor", "Bunny", "Captain", "Nibblets", "Cupcake", "Carrot", "Gnomes", "Glitter", "Potato", "Salad", "Toejam", "Curtains", "Beets", "Toilet", "Exorcism", "Stick Figures", "Mermaid Eggs", "Sea Barnacles", "Dragons", "Jellybeans", "Snakes", "Dolls", "Bushes", "Cookies", "Apples", "Ice Cream", "Ukulele", "Kazoo", "Banjo", "Opera Singer", "Circus", "Trampoline", "Carousel", "Carnival", "Locomotive", "Hot Air Balloon", "Praying Mantis", "Animator", "Artisan", "Artist", "Colorist", "Inker", "Coppersmith", "Director", "Designer", "Flatter", "Stylist", "Leadman", "Limner", "Make-up Artist", "Model", "Musician", "Penciller", "Producer", "Scenographer", "Set Decorator", "Silversmith", "Teacher", "Auto Mechanic", "Beader", "Bobbin Boy", "Clerk", "Station Attendant", "Foreman", "Maintenance Engineering", "Mechanic", "Miller", "Moldmaker", "Panel Beater", "Patternmaker", "Plant Operator", "Plumber", "Sawfiler", "Shop Foreman", "Soaper", "Stationary Engineer", "Wheelwright", "Woodworkers", "Giraffes", "Elephant", "Alien", "Raven", "Dog", "Cat", "Fish", "Eagle", "Shark"];


router.post('/room/chatMsg', (req, res) => {
    console.log(req.body);
    chatRoom.update({_id: req.body.room}, {$push: {chats: req.body}})
    .exec()
    .then(rooms => {
            console.log(rooms);
        })
    .catch(err =>{throw err});
});

router.put('/updateRoom/:id', (req, res) => {
    chatRoom.update({_id: req.params.id}, {$set: {name: req.body.contents}})
    .exec()
    .then(rres => {
            console.log(rres);
            res.end();
        })
    .catch(err =>{throw err});

})


module.exports = router;
