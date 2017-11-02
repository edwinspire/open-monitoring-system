define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/account_details/account_details.html',
  "dojo/dom-class",
  "dojo/on", "dojo/query",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/window",
  "dijit/TooltipDialog",
  "dijit/popup",
  "dojo/topic",
  "dojo/dom-attr",
  "dijit/layout/ContentPane",
  "dijit/layout/TabContainer",
  "Widget/account_data/account_data",
  "Widget/map_points/map_points",
  "Widget/account_contacts_users/account_contacts_users",
  "Widget/account_equipments/account_equipments",
  "Widget/account_events_management/account_events_management"
  ], function (declare, _Widget, _Templated, templateString, domClass, on, query, domStyle, domClass, w, TTD, popup, topic, domAttr) {
/**
     * Application Account
     *
     * @module app_account/app_account
     */
     return declare([_Widget, _Templated], {
      widgetsInTemplate: true,
      templateString: templateString,
      postCreate: function () {
       var t = this;


//domStyle.set(t.domNode, 'min-height', w.getBox().h-70+'px');

t.TabMaster.watch("selectedChildWidget", function(name, oval, nval){
  console.log("selected child changed from ", oval, " to ", nval);

  if(nval.title == "Geolocalizacion"){
    t.AccountMap.render();
  }

});

t.Basic.uDC.on('onSelect', function(e){

  var point = {center: true};
  point.geox = e.data.geox;
  point.geoy = e.data.geoy;
  point.fullname = e.data.last_name+' '+e.data.first_name;
//  console.debug(point)
t.AccountMap.setPoints([point]);
  //t.AccountMap.render();
});



},
Update: function(){
  this.Basic.Update();
},
_setIdaccountAttr: function(_idaccount){
  var t = this;
  if(_idaccount > 0){
   t.Basic.set("idaccount", _idaccount);


   t.ContactsUsers.set('idaccount', _idaccount);
   t.Equipments.set('idaccount', _idaccount);
   t.EventsIsOpen.set('idaccount', _idaccount);

 }else{
  t._notifications({ Urgency: 10, Message: 'No ha seleccionado un registro correcto', Title: 'Selección Incorrecta' });
}

},
resize: function() {
 var t = this;
 t.TabMaster.resize();
 //t.AccountMap.resize();
 //t.ContactsUsers.resize();
 //t.Equipments.resize();
 //t.EventsIsOpen.resize();
},
_widgetResize: function(_w){
 _w.resize();
},
_notifications: function (_args) {
  topic.publish("/event/notification_area/notify", _args);
}


});
   });
