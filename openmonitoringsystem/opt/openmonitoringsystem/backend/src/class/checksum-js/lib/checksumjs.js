"use strict";
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const fs = require('fs');
const Promise = require('promise');

export default class CheckSum{
  constructor(){

  }
  FromFile(ChecksumType, file){

return new Promise((resolve, reject) => {

  var t = this;
  var args = [];

  args.push(ChecksumType);
  args.push('file');
  args.push(file);

  const child = spawn(__dirname+'/bin/checksumjs-cli', args);
  child.on('close', (code, signal) => {
    console.log( `child process terminated due to receipt of signal ${signal}`);
  });

  child.on('exit', (code, signal) => {
console.log(code, signal)
/*
    switch(code){
      case 0:
      //t.emit('mounted', signal);
      break;
      default:
    //  t.emit('fail', {message: 'Ya se encuentra montado', location: args[0], code: code});
    console.log({message: 'Ya se encuentra montado', location: args[0], code: code})
      break;
    }
    */

  });

  child.on('error', (error) => {
    //t.emit('fail', {message: data+'', error: -2});
    console.log(error)
  });

  child.on('message', (message) => {
    console.log(`child process message due to receipt of message ${message}`);
  });

  child.stdout.on('data', (message) => {
   var m = JSON.parse(message.toString());
console.log(m);
  
});

  child.stderr.on('data', function (data) {
    console.log(data)
  });


}  
});


}
