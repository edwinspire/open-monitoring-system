/**
     * Custom Module
     *
     * @module 
     */
     define(['dojo/_base/declare', 'dojo/Evented', 'api/postgres/oms', "dojo/request", "api/postgres/oms_query_builder"
     	], function (declare, Evented, omsPostgreSQL, request) {

     		return declare('octopus', omsPostgreSQL, {

getNetworkDevices: function(){
return this.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE network_devices.idaccount = accounts.idcontact AND accounts.enabled = true AND network_devices.monitored = true;", []);
},
getTask: function(){
return this.query(`
	SELECT 
  view_account_network_devices.idcontact, 
  view_account_network_devices.enabled AS enabled_account, 
  view_account_network_devices.monitored, 
  view_account_network_devices.last_name, 
  view_account_network_devices.first_name, 
  view_account_network_devices.account, 
  view_account_network_devices.idequipment, 
  view_account_network_devices.equipment, 
  view_account_network_devices.ip, 
  view_account_network_devices.username, 
  view_account_network_devices.pwd, 
  view_account_network_devices.report_validator, 
  octopus_by_account.idaccount, 
  octopus_by_account.enabled AS enabled_octopus, 
    octopus_by_account.status,
  octopus_by_account.datetime_start, 
  octopus_by_account.datetime_end, 
  octopus_by_account.last_run, 
  octopus_by_account.next_run, 
  octopus_by_account.parameters, 
  octopus_by_account.trigger_time, 
  octopus_function.idoctopusfunction, 
  octopus_function.enabled AS enabled_function, 
  octopus_function.function_name, 
  octopus_function.default_parameters, 
  octopus_function.label_function, 
  octopus_function.trigger_time AS default_trigger_time
FROM 
  public.view_account_network_devices, 
  octopus.octopus_by_account, 
  octopus.octopus_function
WHERE 
  view_account_network_devices.idcontact = octopus_by_account.idaccount AND
  octopus_by_account.idoctopusfunction = octopus_function.idoctopusfunction
  AND view_account_network_devices.monitored = TRUE AND octopus_by_account.datetime_start <= now() AND (octopus_by_account.datetime_end > NOW() OR octopus_by_account.datetime_end ISNULL) AND octopus_by_account.enabled = true AND (octopus_by_account.next_run <= now() OR octopus_by_account.next_run ISNULL) AND status = 0;
  `, []);
},
send_event_http: function(data_send){
console.dir(data_send);
 return request.post('http://192.168.251.174/njs/receiver', {
  data: data_send,
  preventCache: true,
  handleAs: 'json'
});
},
send_event_pg: function(table, fieldsValues, omitfields){

var qp = this.Insert(table, fieldsValues, omitfields).returning(' idevent ').build();
//console.dir(qp);
return this.query(qp.query, qp.param);
}



});
});
