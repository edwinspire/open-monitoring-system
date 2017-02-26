/**

 * Handles elements

 * @namespace OpenMonitoringSystem

 */
 define([
 	'dojo/_base/declare'
  ], function (declare) {
    /**
     * Micro Data Connector
     *
     * @module uDC/uDC
     */
     return declare([], {

pgConnectionParameters: {},
smtpConfig: {},
mailOptions: {},
ServerPort: 80,

constructor: function(){

this.ServerPort = 8080;
this.pgConnectionParameters = {user: 'postgres', pwd: 'pg4321', host: '192.168.251.174', db: 'oms'};
this.smtpConfig = {host: 'mail.farmaenlace.com', port: 465, ignoreTLS:false, secure: true, auth: {user: 'edwindelacruz', pass: 'embarazador'}};
this.mailOptions = {
    from: '"Edwin De La Cruz 👥" <edwindelacruz@farmaenlace.com>', // sender address 
    to: 'edwinspire@gmail.com', // list of receivers 
    subject: 'Open Monitoring System Start ✔ '+Date.now(), // Subject line 
    text: 'El servidor ha sido iniciado en el puerto '+this.ServerPort, // plaintext body 
    html: '<b>El servidor ha sido iniciado en el puerto '+this.ServerPort+'</b>' // html body 
};

}


        // Fin de funciones //
        //************************************//
      });
});


