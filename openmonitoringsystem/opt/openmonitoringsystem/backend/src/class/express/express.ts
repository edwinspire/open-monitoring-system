import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as EventEmitter from 'events';

export default class WebServer {

  private appexp = express();

  constructor(static_dir: string = undefined) {

    static_dir = static_dir || process.env.EXPRESS_STATIC_DIR;
    this.appexp.use(express.static(static_dir));
    this.appexp.use(cookieParser());
    this.appexp.use(compression());
    this.appexp.use(morgan('common'));
    this.appexp.use( bodyParser.json() );      
    this.appexp.use(bodyParser.urlencoded({    
      extended: true
    })); 

    this.appexp.use(function(req, res, next) {
      console.log(req.originalUrl);
      res.status(404).send('Sorry cant find that!'+' '+static_dir+' - '+req.originalUrl);
    });


  }

  app(){
    return this.appexp;
  }

}