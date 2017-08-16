"use strict";
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const fs = require('fs');
var EventEmitter   = require('events').EventEmitter;
//var extend = require('extend');

var Gvfs = EventEmitter;

Gvfs.prototype.mount = function (args, pwd) {
//location, domain, user, password
args.stdio =  [
    0, // Use parent's stdin for child
    'pipe', // Pipe child's stdout to parent
    fs.openSync('err.out', 'w') // Direct child's stderr to a file
    ]

    var i = 1;

    const child = spawn('gvfs-mount', args);
    child.on('close', (code, signal) => {
      console.log(
        `child process terminated due to receipt of signal ${signal}`);
    });

    child.on('exit', (code, signal) => {
      console.log(
        `child process exit ${code}`);
    });

    child.on('error', (error) => {
      console.log(
        `child process error ${error}`);
    });


    child.on('message', (message) => {
      console.log(
        `child process message due to receipt of message ${message}`);
    });

    child.stdout.on('data', (message) => {
      if(i < 3){
        console.log(
          `>> child process data due to receipt of message ${message} ${i}`);
        child.stdin.write(pwd);
        child.stdin.write('\n');
      }else{
        child.kill();
      }
      i++;
    });

    child.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });


  }

  Gvfs.prototype.info = function () {

    const child = spawn('gvfs-info', args);
    child.on('close', (code, signal) => {
      console.log(
        `child process terminated due to receipt of signal ${signal}`);
    });


    child.on('error', (error) => {
      console.log(
        `child process error ${error}`);
    });


    child.on('exit', (message, sendHandle) => {
      console.log(
        `child process message due to receipt of message ${message}`);
    });

  }


  module.exports = Gvfs;