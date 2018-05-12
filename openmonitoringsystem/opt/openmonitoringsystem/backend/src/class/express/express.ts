import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as Ev from 'events';

export default class WebServer extends Ev.EventEmitter {

  private appexp = express();

  constructor(static_dir: string = undefined) {

    super();

    static_dir = static_dir || process.env.EXPRESS_STATIC_DIR;
    this.appexp.use(express.static(static_dir));
    this.appexp.use(cookieParser());
    this.appexp.use(compression());
    this.appexp.use(morgan('common'));
    this.appexp.use( bodyParser.json() );      
    this.appexp.use(bodyParser.urlencoded({    
      extended: true
    })); 


    this.appexp.post('/services', (req, res)=> {
      //res.send('POST request to the homepage');
      //console.dir(req);
      this.emit('request_services', {req: req, res: res});
    });
    

    this.appexp.use(function(req, res, next) {
      console.log(req.originalUrl);
      res.status(404).send('Sorry cant find that!'+' '+static_dir+' - '+req.originalUrl);
    });




  }
  public app(){
    return this.appexp;
  }


  public post(route: string, fun: any){
    this.appexp.post(route,  (req, res)=> {
      //res.send('POST request to the homepage');
      fun(req, res);
    });
  }
}