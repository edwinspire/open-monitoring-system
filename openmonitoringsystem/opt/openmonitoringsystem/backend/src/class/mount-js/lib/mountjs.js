"use strict";
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const fs = require('fs');
var EventEmitter   = require('events').EventEmitter;

var MountJS = EventEmitter;
MountJS.prototype.parameters = {domain: '', username: '', password: '', location: '', protocol: 'smb', timeout: 60, anonymous: true};

MountJS.prototype.mount = function (_param) {
  var t = this;
  var args = [];

  if(_param){
    this.parameters = _param;
  }

  args.push(this.parameters.protocol);
  args.push(this.parameters.domain);
  args.push(this.parameters.location);
  args.push(this.parameters.anonymous);
  args.push(this.parameters.username);
  args.push(this.parameters.password);
  args.push(this.parameters.timeout);

  const child = spawn(__dirname+'/bin/mountjs-cli', args);
  child.on('close', (code, signal) => {
    //console.log( `child process terminated due to receipt of signal ${signal}`);
  });

  child.on('exit', (code, signal) => {

    switch(code){
      case 0:
      //t.emit('mounted', signal);
      break;
      default:
      t.emit('fail', {message: 'Ya se encuentra montado', location: args[0], code: code});
      break;
    }

  });

  child.on('error', (error) => {
    t.emit('fail', {message: data+'', error: -2});
  });

  child.on('message', (message) => {
    console.log(`child process message due to receipt of message ${message}`);
  });

  child.stdout.on('data', (message) => {
   var m = JSON.parse(message.toString());

   if(m.error){
    t.emit('fail', m);
  }else{
    t.emit('mounted', m);
  }
  
});

  child.stderr.on('data', function (data) {
    t.emit('fail', {message: data+'', error: -2});
  });


}

module.exports = MountJS;