/**
     * Custom Module
     *
     * @module 
     */
     define(['dojo/_base/declare', 'dojo/Evented', "api/octopus/octopus", "dojo/_base/array", "dojo/date", "dojo/date/stamp", "dojo/Deferred",  "api/postgres/oms_query_builder"
      ], function (declare, Evented, Octo, array, date, stamp, Deferred) {

        return declare('scheduled_tasks', Octo, { 

          getTaskList: function(){
            return this.query(`
              SELECT * FROM scheduled_tasks.task_list WHERE function_name like 'run_%' AND  enabled = true AND task_start <= now() AND (task_end > now() OR task_end IS NULL)  AND (next_run IS NULL OR next_run <= now());
              `, []);
          },
          taskNoFound: function(idtask){
            return this.query(`
              UPDATE scheduled_tasks.task_list SET last_run = now(), status = $1::INTEGER WHERE idtask = $2::BIGINT;
              `, [1, idtask]);
          },
          startTask: function(task){

            var deferred = new Deferred();
            var t = this;

            var next_run = new Date();
            if(task.task_trigger.interval && task.task_trigger.interval.minutes){
              next_run = date.add(next_run, "minute", task.task_trigger.interval.minutes);
            }

            
            t.query(`
              UPDATE scheduled_tasks.task_list SET last_run = now(), status = $1::INTEGER, next_run = $3::timestamp with time zone WHERE idtask = $2::BIGINT;
              `, [2, task.idtask, next_run]).then(function(result){

                t[task.function_name](task).then(function(taskresult){
                //  console.log('Ha terminado '+task.function_name);
                deferred.resolve(result);
              });

              }, function(fail){
                deferred.reject(fail);
              });

              return  deferred.promise;
            },
            endTask: function(task){
              var deferred = new Deferred();
              console.log('>>>>>>>>>>>>> endTask', task);
              return   this.query(`
                UPDATE scheduled_tasks.task_list SET duration = EXTRACT(EPOCH FROM (now() - last_run)), status = $1::INTEGER  WHERE idtask = $2::BIGINT;
                `, [0, task.idtask]).then(function(result){
                  deferred.resolve(result);
                }, function(err){
                 deferred.reject(err); 
               });
                return  deferred.promise;
              }    



            });
      });