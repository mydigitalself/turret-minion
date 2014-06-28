var Player = require('player');
var five = require('johnny-five');
var Easing = require('easing');

var board = new five.Board();

var pan;
var led;
var tilt;

var panValue;
var tiltValue;

function Queue(executor) {
  this.queue = [];
  this.executor = executor;
}

Queue.prototype.add = function(value, done) {
  this.queue.push({ value: value, callback: done });
  if(!this.running) {
    this.next();
  } 
}

Queue.prototype.next = function() {

  this.running = this.queue.length > 0;
  if(!this.running) return;

  var self = this;

  var item = this.queue.shift()

  this.executor(item.value, function() {
    setImmediate(function() {
      if(item.callback) item.callback();
      self.next();
    });
  });
}

var tiltQueue = new Queue(function(value, done) { 
  internalTiltTo(value, done);
})

var panQueue = new Queue(function(value, done) { 
  internalPanTo(value, done);
})


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
  tiltQueue.add(10);
  tiltQueue.add(170);
  tiltQueue.add(90);

  // tiltTo(10, function() {
  //   tiltTo(170, function() {
  //     tiltTo(90);
  //   });
  // });

  panQueue.add(10);
  panQueue.add(170);
  panQueue.add(90);

  // panTo(10, function() {
  //   panTo(170, function() {
  //     panTo(90);
  //   });
  // });
}
exports.arise = arise;

function fireLaser(time){
  led.strobe(100);
  setTimeout(function () {
    led.stop().off();
  }, time);
}
exports.fireLaser = fireLaser;

function internalPanTo(value, done) {
  smooth(panValue, value, 120, 15, function(value) { 
    pan.to(value);
  }, function(value) {
    panValue = value;
    if(done) done(value);
  });
}  
function panTo(value, done) {
  panQueue.add(value, done);
}
exports.panTo = panTo;

function internalTiltTo(value, done) {
  smooth(tiltValue, value, 120, 15, function(value) { 

    tilt.to(value);
  }, function(value) {
    tiltValue = value;
    if(done) done(value);
  });
}  

function tiltTo(value, done) {
  tiltQueue.add(value, done);
}
exports.tiltTo = tiltTo;







