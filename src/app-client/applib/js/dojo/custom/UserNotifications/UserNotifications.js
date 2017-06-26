define(['dojo/_base/declare',
  "dojo/dom-construct",
  "dojo/dom-style", 
  'dojo/on',
  "dojo/topic",
  "dojo/cookie",
  "dojox/encoding/digests/MD5",
  "dojo/_base/window"
  ], function (declare, domConstruct, domStyle, on, topic, cookie, MD5, win) {

    return declare(null, {

      idWidgetGlobal: '',

      constructor: function(){
        var t = this;
        this.idWidgetGlobal = MD5(window.location.href, dojox.encoding.digests.outputTypes.Hex);

// Esto previene que haya mas de un widget activo en la pagina
if(!dojo.byId(this.idWidgetGlobal)){

  domConstruct.create("div", {id: this.idWidgetGlobal, style: {border: 'none', 'background-color': 'transparent', height: 'auto', position: 'fixed', bottom: 0, right: 0,  'z-index':999998}}, win.body());

  var nodeAudio = domConstruct.create("audio", {autoplay: true});
  nodeAudio.innerHTML = '<source src="applib/media/snd/NuevosIncidentes.ogg" type="audio/ogg">';
  domConstruct.place(nodeAudio, this.idWidgetGlobal, 'first');

  topic.subscribe("/event/user/notify", function(data){


  console.log(nodeAudio, nodeAudio.ended, data.Snd);

    if(nodeAudio.ended && (!data.Snd || data.Snd.length <= 1 || data.Snd == '')){
      console.log('Debe sonar');
      nodeAudio.play(); 
    }

    t._Notify(data);
    
  }); 

}   else{
  console.warn('Ya existe un UserNotifications activo en esta pagina ', idWidgetGlobal);
}              


},
_args: function(a) {
  if (a.Message === undefined || a.Message.length < 1) {
    a.Message = '';
  }

  if (a.Title === undefined || a.Title.length < 1) {
    a.Title = '';
  }



  if (a.IconClass === undefined || a.IconClass.length < 1) {
    a.IconClass = 'glyphicon-bell';
  }


  //a.Snd = 'applib/media/snd/bong-chime-2.ogg';


  if (a.Timeout === undefined || a.Timeout < 2) {
    a.Timeout = 10;
  }

  if (a.Urgency === undefined || a.Urgency < 1) {
    a.Urgency = 100;
  }

  return a;
},
_set_iconclass: function(iconclass, defaulticonclass){
  var icon = 'glyphicon-bell';
  if (iconclass === undefined || iconclass.length < 1) {
    icon = defaulticonclass;
  }else{
    icon = iconclass;
  }
  return icon;
},      
_Notify: function (args_) {

  var args = this._args(args_);

  if (true) {
//     if (!("Notification" in window)) {
  this._notify_browser_not_support(args);
} else if (Notification.permission === "granted") {
  this._notify_browser(args);
}else if (Notification.permission !== 'denied') {
  Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        this._notify_browser(args);
      }
    });
}else{
  this._notify_browser_not_support(args, bsc);
}


},
_notify_browser: function(args){
  var n = new Notification(args.Title, {body: args.Message, sound: args.Snd});
  setTimeout(n.close.bind(n), args.Timeout * 1000); 
},
_notify_browser_not_support: function(args){

  var bsc = 'UserNotifications ';

  if (args.Urgency <= 2) {
              //  bsc = '#d80000';
              bsc = bsc+'UserNotifications_12';
              
            } else if (args.Urgency <= 4) {
               // bsc = '#ff6100';
               bsc = bsc+'UserNotifications_34';
               
             } else if (args.Urgency <= 6) {
               // bsc = '#ffc700';
               bsc = bsc+'UserNotifications_56';
               
             } else if (args.Urgency <= 8) {
               // bsc = '#ffe100';
               bsc = bsc+'UserNotifications_78';
               
             } else if (args.Urgency <= 10) {
               // bsc = '#ffe100';
               bsc = bsc+'UserNotifications_910';
               
             } else {
               // bsc = '#8b9fb2';
               bsc = 'UserNotifications';
             }

             var node = domConstruct.create("span");

// Esta funcion hace que la notificacion se cierre al hacer click en ella.
if (args.Closable) {
  dojo.connect(node, "onclick", function () {
    domConstruct.destroy(this);
  });
}

if(args.Snd && args.Snd.length > 0){
  //alert('Con sonido '+args.Snd);
  node.innerHTML = ' <div class="'+ bsc +'"> <i class="dijitIcon flat-error-o" style="font-size: 2em;"></i><span class="glyphicon '+args.IconClass+'" aria-hidden="true"></span><span class="notificacion_area_title">' + args.Title + '</span>  <div class="notificacion_area_message">' + args.Message + '</div> <audio autoplay volumen="0.5"><source src="' + args.Snd + '" type="audio/ogg"> <source src="media/snd/notify.mp3" type="audio/mpeg"> </audio> </div>';
}else{
  node.innerHTML = ' <div class="'+ bsc +'"> <i class="dijitIcon flat-error-o" style="font-size: 2em;"></i><span class="glyphicon '+args.IconClass+'" aria-hidden="true"></span><span class="notificacion_area_title">' + args.Title + '</span>  <div class="notificacion_area_message">' + args.Message + '</div> </audio> </div>';
}

domConstruct.place(node, this.idWidgetGlobal, 'first');

setTimeout(function () {
  domConstruct.destroy(node);
}, args.Timeout * 1000);


}









});
});
