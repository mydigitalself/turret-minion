var Player = require('player');
var five = require('johnny-five');
var Easing = require('easing');

var board = new five.Board();

var pan;
var led;
var tilt;

var panValue;
var tiltValue;

board.on('ready', function () {
  pan = new five.Servo(9);
  led = new five.Led(11);
  tilt = new five.Servo(10);

  panValue = 90;
  pan.to(panValue);

  tiltValue = 90;
  tilt.to(tiltValue);

});

function smooth(start, stop, steps, time, callback, complete) {
  if(start === stop) return complete(stop);

  var ease = Easing(steps, 'sinusoidal');
  var currentStep = 0;

  function step() {
    var current = ease[currentStep] * (stop - start) + start;
    callback(current);

    currentStep++;
    
    if(currentStep >= steps) {
      return complete(current); // done
    }

    setTimeout(step, time);
  }

  step();
}

function arise() {
  tiltTo(10, function() {
    tiltTo(170, function() {
      tiltTo(90);
    });
  });
  panTo(10, function() {
    panTo(170, function() {
      panTo(90);
    });
  });
}
exports.arise = arise;

function fireLaser(time){
  led.strobe(100);
  setTimeout(function () {
    led.stop().off();
  }, time);
}
exports.fireLaser = fireLaser;

function panTo(value, done) {
  smooth(panValue, value, 120, 15, function(value) { 
    pan.to(value);
  }, function(value) {
    panValue = value;
    if(done) done(value);
  });
}  
exports.panTo = panTo;

function tiltTo(value, done) {
  smooth(tiltValue, value, 120, 15, function(value) { 

    tilt.to(value);
  }, function(value) {
    tiltValue = value;
    if(done) done(value);
  });
}  
exports.tiltTo = tiltTo;







