/**
     * Postgres custom methods
     *
     * @module postgres.oms
     */
     define(['dojo/_base/declare',  "dojo/Evented", "dojo/Deferred", "dojo/node!nodemailer"
     	], function (declare, Evented, Deferred) {

     		return declare('sendEmail', Evented, {

//host: process.env.SMPT_HOST, port: process.env.SMPT_PORT, ignoreTLS: process.env.SMPT_IGNORETLS, secure: process.env.SMPT_SECURE, auth: {user: process.env.SMPT_AUTH_USER, pass: process.env.SMPT_AUTH_PWD}}
//////////////////////////////////
// The constructor
constructor: function(args) {


},
startup: function(){
	console.log('Startup');
}




});
});
