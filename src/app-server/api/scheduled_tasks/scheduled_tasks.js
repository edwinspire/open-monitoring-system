/**
     * Custom Module
     *
     * @module 
     */
     define(['dojo/_base/declare', 'dojo/Evented', "api/octopus/octopus", "dojo/_base/array", "api/postgres/oms_query_builder"
      ], function (declare, Evented, Octo, array) {

        return declare('scheduled_tasks', Octo, { 

          getNetworkDevices: function(){
            return this.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE network_devices.idaccount = accounts.idcontact AND accounts.enabled = true AND network_devices.monitored = true;", []);
          },
          getTaskList: function(){
            return this.query(`
              SELECT * FROM scheduled_tasks.task_list WHERE function_name like 'run_%' AND  enabled = true AND task_start <= now() AND (task_end > now() OR task_end IS NULL)  AND (next_run IS NULL OR next_run <= now());
              `, []);
          },
          taskNoFound: function(idtask){
            return this.query(`
              UPDATE scheduled_tasks.task_list SET last_run = now(), status = $1::INTEGER WHERE idtask = $2::BIGINT;
              `, [1, idtask]);
          }  



        });
      });