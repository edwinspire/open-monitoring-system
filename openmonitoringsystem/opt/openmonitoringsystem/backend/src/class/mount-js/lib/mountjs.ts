const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
import * as dojo from "@dojo/core";
import * as fs from 'fs';
import Promise from "@dojo/shim/Promise";

export interface MountFSParam {
  protocol: string;
  domain: string;
  location: string;
  anonymous: boolean;
  username: string;
  password: string;
  timeout: number;
}

export interface Mounted
{ mount: 
  { can_eject: boolean,
    can_unmount: boolean,
    icon: string,
    name: string,
    root: string,
    sort_key: string,
    uuid: string,
    location: string,
    is_shadowed: boolean,
    default_location: string },
    params: MountFSParam

  }


  export interface MountError{ error: 
    { code: number,
      message: string },
      params: MountFSParam }


      export default class MountFS{
        private param: MountFSParam;
        private _mounted: Mounted;
        constructor(param?: MountFSParam){
          if(param){
            this.param = param;
          }

        }

        public get mounted() : Mounted {
          return this._mounted;
        }

        mount(_param?: MountFSParam) {

          if(_param){
            this.param = _param;
          }

          return new Promise((resolve, reject) => {

            if(this.param){
              var args = [];

              args.push(this.param.protocol);
              args.push(this.param.domain);
              args.push(this.param.location);
              args.push(this.param.anonymous);
              args.push(this.param.username);
              args.push(this.param.password);
              args.push(this.param.timeout);

              const child = execFile(__dirname+'/bin/mountjs-cli', args, (error, stdout, stderr) => {

                if (error) {
                  reject(error);
                }else{

                  let r = JSON.parse(stdout.toString());

                  if(r.error){
                    reject(r)
                  }else{
                    this._mounted = r as Mounted;
                    resolve(r as Mounted)
                  }

                }

              });
            }else{
              reject({error: 1, message: 'No parameter'});
            }

          });

        }

      }



