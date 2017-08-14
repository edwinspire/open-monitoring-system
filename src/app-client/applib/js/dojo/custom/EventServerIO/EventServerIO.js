define(['dojo/_base/declare',
    "dojo/topic",
    "socketio/socketio",
    "dojo/cookie"
    ], function (declare, topic, io, cookie) {

        return declare(null, {

            constructor: function(){

                var hostws = '//'+document.location.host;
                var socket = io.connect(hostws);
                
console.log(hostws);

                socket.on('connection', function(client) {  
                    console.log('Client connected to '+hostws);
                    //socket.emit('heartbeat', {sessionidclient: cookie('oms_sessionidclient'), token: cookie('oms_sessiontoken')});
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
                  console.log(command);
                switch(command.command){
                    case 'logout':
                    //window.location="/logout";
                    break; 
                    case 'heartbeat':
                    socket.emit('heartbeat', {sid: cookie('connect.sid')});
                    break;   
                    case 'clearCache':
                    window.location.reload(true);
                    break;          

                }

            });


                setInterval(function(){

var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 1 ; i <= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i-1] + "\n";
    }

    console.log(aString);

        //socket.send(cookie('oms_sessionidclient')+'dfdsfdsf');
        cookie("favouriteDish", "Noodles", { expires: 5 });

console.log(cookie("favouriteDish"), cookie);

        console.log(cookie("connect.sid"), cookie("io"));
     
        //alert();  
        socket.emit('heartbeat', {sid: cookie('connect.sid')});
    }, 30000);




            }


        });
    });
