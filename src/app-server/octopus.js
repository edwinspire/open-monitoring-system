require(["dojo/request",
	"dojo/on", 
	"dojo/_base/array", 
	"dojo/node!crypto",
	"dojo/node!path", 
	"dojo/node!fs", 
	"dojo/node!url", 
	"dojo/node!path-to-regexp", 
	"dojo/node!pg", 
	"dojo/node!compression", 
	"dojo/node!mssql", 
	"dojo/node!nodemailer",
	"api/postgres/oms", 
	"dojox/encoding/digests/MD5", 
	"api/config", 
	"api/postgres/udc_dgrid_structure", 
	"api/postgres/oms_query_builder", 
	"api/postgres/udc_table_accounts", 
	"api/postgres/udc_table_phones", 
	"api/postgres/udc_table_emails", 
	"api/postgres/udc_table_account_contacts", 
	"api/postgres/udc_table_account_users",
	"api/postgres/udc_table_account_equipments",
	"api/postgres/udc_farma_view_lista_precios",
	"api/postgres/udc_tables_views",
	"api/postgres/udc_tables_columns",
	"api/postgres/udc_table_groups",
	"api/postgres/udc_table_account_events_isopen",
	"api/postgres/udc_table_events_isopen",
	"api/postgres/udc_table_events_details",
	"api/postgres/udc_table_events",
	"api/postgres/udc_account_events_comments"  
	], function(request, on, array, crypto, path, fs, pathToRegexp, pG, compression, mssql, nodeMailer, pgOMS, MD5, Config){


var ConfigParameter = new Config();

console.log(ConfigParameter);

		var sessionUsers = new sessionusers();
		var PostgreSQL = new pgOMS(ConfigParameter.pgConnectionParameters);


		setInterval(function(){
			console.log('Tareas periodicas');
			PostgreSQL.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE   network_devices.idaccount = accounts.idcontact;", []).then(function(response){
				console.log(response);
			});
		}, 60*1000);



		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
// create reusable transporter object using the default SMTP transport 
var transporter = nodeMailer.createTransport(ConfigParameter.smtpConfig);

/*
// send mail with defined transport object 
transporter.sendMail(ConfigParameter.mailOptions, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log('Message email sent: ' + info.response);
});
*/





process.on('uncaughtException', function(error){
	console.log(error);
});


});