define(['dojo/_base/declare',
            "dojo/topic",
            "socketio/socketio",
            "dojo/cookie"
    ], function (declare, topic, io, cookie) {

        return declare(null, {
         
constructor: function(){

                var socket = io.connect('http://'+document.location.host);

                socket.on('connection', function(client) {  
                    console.log('Client connected. web component..');
                    socket.emit('heartbeat', {sessionidclient: cookie('oms_sessionidclient'), token: cookie('oms_sessiontoken')});
                });


                socket.on('notifying_the_user', function(data) {
                    var item = JSON.parse(data);
                    //console.log(item);
                    topic.publish("/event/user/notify", {Message: item.body, Title: item.title, iconClass: item.iconClass, Snd: item.snd, Timeout: item.timeout, Urgency: item.urgency, Closable: item.closable});
                });

                socket.on('pgtschange', function(data) {
                    var tables = JSON.parse(data);
                    if(tables && tables.table_name){                         
                        var eventurl = "/event/table/changed/"+tables.table_name;                                               
                        topic.publish(eventurl, [{table: tables.table_name}]);
                    }

                });



                socket.on('command', function(data) {
                    var command = data;
                //  console.log(command);
                switch(command.command){
                    case 'logout':
                    window.location="/njs/logout";
                    break; 
                    case 'heartbeat':
                    socket.emit('heartbeat', {sessionidclient: cookie('oms_sessionidclient')});
                    break;   
                    case 'clearCache':
                    window.location.reload(true);
                    break;          

                }

            });


                setInterval(function(){
        //socket.send(cookie('oms_sessionidclient')+'dfdsfdsf');
        socket.emit('heartbeat', {sessionidclient: cookie('oms_sessionidclient')});
    }, 30000);




}


    });
    });
