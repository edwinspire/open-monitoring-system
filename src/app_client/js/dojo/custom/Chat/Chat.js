define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Chat/Chat.html',
    "dijit/TooltipDialog",
    "dijit/popup", 
    'dojo/request',
    "dojo/on",
    "dojo/_base/array"
    ], function (declare, _Widget, _Templated, templateString, TTD, popup, request, on, array) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            postCreate: function () {

                var t = this;

                var myTooltipDialog = new TTD({
                    style: "width-max: 100px; height: 75%;",
                    content: '                  <ul  class="list-unstyled msg_list" role="menu">               <li><a><span class="image"><img src="images/img.jpg" alt="Profile Image" /></span>   <span>       <span>John Smith</span> <span class="time">3 mins ago</span> </span> </a> </li>                  </ul>',
                    onMouseLeave: function(){
                        popup.close(myTooltipDialog);
                    }
                });

                on(t.Chat, 'click', function(){

                    t._admins(myTooltipDialog);

                });  

            },
            _admins: function (myTooltipDialog) {
                var t = this;
                var url = '/njs/admin_status_login';
                request.post(url, {
                // Parse data from xml
                handleAs: "json"
            }).then(
            function (response) {

//console.log(response);
var Content = '<ul  class="list-unstyled msg_list" role="menu">';

array.forEach(response, function(user){
    console.debug(user);
    Content = Content+t._create_user_card(user.fullname, true, user.login, Date.now());
});


Content = Content+' </ul>';
//console.log(Content);
myTooltipDialog.set('content', Content);

popup.open({
    popup: myTooltipDialog,
    around: t.Chat
});


},
function (error) {
                        // Display the error returned
                        t.Notify({Title: url, Message: error});
                    }
                    );
        },
        _create_user_card: function(name, logged, last_access, last_heartbeat){
            var t = 'undefined';
            var status = 'undefined';
            if(logged){
                t = last_access;
                status = 'Conectado';
            }else{
                t = last_heartbeat;
                status = 'Desconectado';
            }

            try{
                //var time = new Date(t.replace('T', ' ')).toLocaleString();
                var time = new Date(last_access).toLocaleString();
            }catch(e){
                time = 'Nunca';
            }


            return '<li><a><span class="image"><img src="images/img.jpg" alt="'+name+'" /></span>   <span>       <span>'+name+'</span> <div class="time">'+status+' desde '+time+'</div> </span> </a> </li> ';
        }





    });
    });
