/**
     * Custom Module
     *
     * @module 
     */
     define(['dojo/_base/declare', 'dojo/Evented', 'api/postgres/oms', "api/postgres/oms_query_builder", 
  "api/octopus/ping"
     	], function (declare, Evented, omsPostgreSQL) {

     		return declare('octopus', omsPostgreSQL, {

          getNetworkDevices: function(){
            return this.query("SELECT accounts.idaccount, accounts.enabled AS enabled_account, account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE network_devices.idaccount = accounts.idaccount AND accounts.enabled = true AND network_devices.monitored = true;", []);
          },
          send_event_http: function(data_send){
            console.dir(data_send);
            return request.post('http://192.168.251.174/njs/receiver', {
              data: data_send,
              preventCache: true,
              handleAs: 'json'
            });
          },
          send_event_pg: function(fieldsValues, omitfields){

            var qp = this.Insert('events.datas', fieldsValues, omitfields).build();
            console.dir(qp);

            return this.query(qp.query, qp.param);
          }/*,
          LoadTask: function(){
            var t = this;
            t.getTask().then(function(task){
              t.Task.setData(task.rows);
            });  
          }*/

        }); 
      });
