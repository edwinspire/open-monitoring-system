process.env.PORT = 8080;

process.env.PG_USER = 'postgres';
process.env.PG_PWD = 'pg4321';
process.env.PG_HOST = 'localhost';
process.env.PG_DB = 'oms';

process.env.SMPT_HOST = 'mail.localhost.com';
process.env.SMPT_PORT = 465;
process.env.SMPT_IGNORETLS = false;
process.env.SMPT_SECURE = true;
process.env.SMPT_AUTH_USER = 'user';
process.env.SMPT_AUTH_PWD = 'password';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';


//this.ServerPort = 8080;
//this.pgConnectionParameters = {user: 'postgres', pwd: 'pg4321', host: 'localhost', db: 'oms'};
//this.smtpConfig = {host: 'mail.localhost.com', port: 465, ignoreTLS:false, secure: true, auth: {user: 'user', pass: 'password'}};
// this.mailOptions = {
//     from: '"Edwin De La Cruz 👥" <edwindelacruz@farmaenlace.com>', // sender address 
//     to: 'edwinspire@gmail.com', // list of receivers 
//     subject: 'Open Monitoring System Start ✔ '+Date.now(), // Subject line 
//     text: 'El servidor ha sido iniciado en el puerto '+this.ServerPort, // plaintext body 
//     html: '<b>El servidor ha sido iniciado en el puerto '+this.ServerPort+'</b>' // html body 
// };
