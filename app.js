var Player = require('player');
var Gitter = require('node-gitter');
var robot = require('./robot');

var token = process.env.TOKEN;
var room = process.env.ROOM;

var gitter = new Gitter(token);

function arise() {
  console.log("Initialising awake sequence. Awaiting further commands Lord Vader.");
  robot.arise();

}

function manoeuvre() {
  console.log("Tracking the bad guys, Lord Vader.");

  var panto;
  var thispan;

  robot.panTo(120);

  robot.tiltTo(30);


}

function fire() {
  console.log('Firing at the things!');
  
  robot.fireLaser(3000);

  var player = new Player('./sound/laser.mp3');
  player.play(function(err, player){
    console.log('PEW! PEW! PEW!');
  });
}

function movex(distance) {
  console.log("Yes Lord Vader, moving x axis: " + distance);

  robot.panTo(distance);

  // smooth(0, distance, 120, 15, function(value) { 
  //   pan.to(value);
  // });
}

function movey(distance) {
  console.log("Yes Lord Vader, y axis: " + distance);

  robot.tiltTo(distance);
  // smooth(0, distance, 120, 15, function(value) { 
  //   tilt.to(value);
  // });

}

gitter.currentUser()
.then(function(user) {
  console.log('Connected and awaiting your instructions Lord Vader');
});


gitter.rooms.join(room).then(function(room) {
  var events = room.listen();

  events.on('message', function(message) {

    var m = /(minions ARISE)|(minions to 2 o clock)|(minions FIRE AT THE THINGS!)|(minions (pan|tilt) (\d+))/i.exec(message.text);

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
      if (m[5] == 'pan') {
        robot.panTo(parseInt(m[6],10));
      }
      if (m[5] == 'tilt') {
        robot.tiltTo(parseInt(m[6],10));
      }
    }
  });
});







