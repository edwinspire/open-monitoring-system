/**
     * Custom Module
     *
     * @module 
     */
     define(['dojo/_base/declare', 'dojo/Evented', 'api/postgres/oms', "api/postgres/oms_query_builder", 
  "api/octopus/ping"
     	], function (declare, Evented, omsPostgreSQL) {

     		return declare('octopus', omsPostgreSQL, {

          send_event_http: function(data_send){
            console.dir(data_send);
            return request.post('http://192.168.251.174/njs/receiver', {
              data: data_send,
              preventCache: true,
              handleAs: 'json'
            });
          },
          send_event_pg: function(table, fieldsValues, omitfields){

            var qp = this.Insert(table, fieldsValues, omitfields).build();

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
