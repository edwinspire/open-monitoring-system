/**
     * Custom Module
     *
     * @module 
     */
     define(['dojo/_base/declare', 'dojo/Evented', 'api/postgres/oms'
     	], function (declare, Evented, PostgreSQL) {

     		return declare('octopus', Evented, {

propertyX: 0,

//////////////////////////////////
// The constructor
constructor: function(args) {
	dojo.safeMixin(this,args);
var t = this;

},
getNetworkDevices: function(){
var pg	= new PostgreSQL({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});
return pg.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE network_devices.idaccount = accounts.idcontact AND accounts.enabled = true AND network_devices.monitored = true;", []);
}



});
});
