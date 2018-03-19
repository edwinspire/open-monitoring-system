const express = require('express');
const  https = require('https');
const  fs = require('fs');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');

var app = express();

var webServer = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  requestCert: false
}, app);

app.use(express.static(process.env.EXPRESS_STATIC_DIR));
app.use(cookieParser());
app.use(compression());
app.use(morgan('common'));
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
})); 


app.use(function(req, res, next) {
  console.log(req.originalUrl);
  res.status(404).send('Sorry cant find that!'+' '+process.env.EXPRESS_STATIC_DIR+' - '+req.originalUrl);
});



webServer.listen(47443, function () {
  console.log('Example app listening on port 49443!');
});



























