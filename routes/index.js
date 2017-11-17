const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Random = require('../models/random');
const chatRoom = require('../models/chatroom');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('home');
    //response.sendFile(__dirname + '/public/index.html');
});

router.post('/createRoom', (req, res) => {

    console.log('Create Room');

    var n = new chatRoom();

    n.name = randomEl(adjectives)+' '+randomEl(nouns);
    n.save(function(err,room) {
        console.log(room.id);
        res.send({redirect:`/room/${room.id}`}); 
    }); 
});



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

function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

var adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];

module.exports = router;
