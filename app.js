var Player = require('player');
var Gitter = require('node-gitter');

var token = process.env.TOKEN;
var room = process.env.ROOM;

var gitter = new Gitter(token);


function arise() {
  console.log("Initialising awake sequence. Awaiting further commands Lord Vader.");
}


function manoeuvre() {
  console.log("Tracking the bad guys, Lord Vader.");
}

function fire() {
  console.log('Firing at the things!');

  var player = new Player('./sound/laser.mp3');
  player.play(function(err, player){
    console.log('PEW! PEW! PEW!');
  });
}

function movex(distance) {
  console.log("Yes Lord Vader, moving x axis: " + distance);
}

function movey(distance) {
  console.log("Yes Lord Vader, y axis: " + distance);
}

gitter.currentUser()
.then(function(user) {
  console.log('Connected and awaiting your instructions Lord Vader');
});


gitter.rooms.join(room).then(function(room) {
  var events = room.listen();

  events.on('message', function(message) {

    var m = /(minions ARISE)|(minions to 2 o clock)|(minions FIRE AT THE THINGS!)|(minions (left|right|up|down) (\d+))/i.exec(message.text);

    if (!m) return;

    if (m[1]) {
      arise();
    }

    if (m[2]) {
      manoeuvre();
    }

    if (m[3]) {
      fire();
    }

    if (m[5]) {
      if (m[5] == 'left') {
        movex(-m[6]);
      }
      if (m[5] == 'right') {
        movex(m[6]);
      }
      if (m[5] == 'up') {
        movey(m[6]);
      }
      if (m[5] == 'down') {
        movey(-m[6]);
      }
    }


  });
});



