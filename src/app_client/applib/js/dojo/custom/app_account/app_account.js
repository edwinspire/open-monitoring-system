define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/app_account/app_account.html',
  "dojo/dom-class",
  "dojo/on", "dojo/query",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/window",
  "dijit/TooltipDialog",
  "dijit/popup",
  "dojo/topic",
  "dojo/dom-attr",
  "dijit/layout/StackContainer",
  "dijit/layout/ContentPane",
  "dijit/layout/StackController",
  "Widget/PageContainer/PageContainer",
  "FilteringSelectGlobalStore/FilteringSelectGlobalStore",
  "dijit/layout/TabContainer",
  "account_data/account_data",
  "Widget/map_points/map_points",
  "dijit/ToolbarSeparator",
  "Widget/account_contacts_users/account_contacts_users",
  "Widget/account_equipments/account_equipments",
  "Widget/event_management/event_management"  
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


//	console.log(t.SelectAccounts.Config);
t.SelectAccounts.queryExpr = '*${0}*';
t.SelectAccounts.searchDelay = 600;

domStyle.set(t.domNode, 'min-height', w.getBox().h-70+'px');

t.TabMaster.watch("selectedChildWidget", function(name, oval, nval){
  console.log("selected child changed from ", oval, " to ", nval);

  if(nval.title == "Geolocalizacion"){
    t.AccountMap.render();
  }

});

// //t.SelectorPage.as_page();


// on(t.WData, 'click', function () {
//   t.SelectorPage.selectPage(0);
//   t._ChangeWidget(this);
//   // domStyle.set(t.Basic.domNode, "display", "block");
//   // t._widgetResize(t.Basic);
// });		

// on(t.WGeo, 'click', function () {
//   t._ChangeWidget(this);
//   // domStyle.set(t.AccountMap, "display", "block");
//   // //t._widgetResize(t.AccountMap);
//   //console.debug(t.Basic.uDC.getData());
//   //t.SelectorPage.selectChild(t.AccountMapX, true);
//   t.SelectorPage.selectPage(1);
//   t.AccountMap.render();
// });	

// on(t.WContacts, 'click', function () {
//   t._ChangeWidget(this);
//   // domStyle.set(t.ContactsUsers.domNode, "display", "block");
//   // t._widgetResize(t.ContactsUsers);
//   //t.SelectorPage.selectChild(t.ContactsUsers, true);
//   t.SelectorPage.selectPage(2);
// });	 

// on(t.WUsers, 'click', function () {
//   t._ChangeWidget(this);
//   // domStyle.set(t.ContactsUsers.domNode, "display", "block");
//   // t._widgetResize(t.ContactsUsers);
//   t.SelectorPage.selectPage(3);
// });	 

// on(t.WEquipment, 'click', function () {
//   t._ChangeWidget(this);
//   // domStyle.set(t.Equipments.domNode, "display", "block");
//   // t._widgetResize(t.Equipments);
//   t.SelectorPage.selectPage(4);
// });	  


// on(t.WEvents, 'click', function () {
//   t._ChangeWidget(this);
//   // domStyle.set(t.EventsIsOpen.domNode, "display", "block");
//   // t._widgetResize(t.EventsIsOpen);
//   t.SelectorPage.selectPage(5);
// });	            


on(t.Save, 'click', function () {
  console.log('Se hecho click en guardar');
  t.Basic.Update();
});


// on(t.NewAccount, 'click', function (e) {

//  popup.open({
//   popup: t.DTTNewAccount,
//   around: t.NewAccount
// });

// });

// on(t.DTTNewAccountOK, 'click', function(){
// // Bloquear todos los campos y botones necesarios
// t._disable_element(t.ContentForms, true);

// // Debemos resetear los campos de todos los forms y tablas cargadas al momento
// t.Basic.Clear();
// t.ContactsUsers.Clear();

// // Debemos desbloquear el area para que sea editable
// t._disable_element(t.ContentForms, false);
// });


// on(t.DTTNewAccount, 'mouseleave', DTTNewAccountClose);
// on(t.DTTNewAccountCancel, 'click', DTTNewAccountClose);

// function DTTNewAccountClose(){
//   popup.close(t.DTTNewAccount);
// }



t.Basic.uDC.on('onSelect', function(e){
 
  var point = {center: true};
  point.geox = e.data.geox;
  point.geoy = e.data.geoy;
  point.fullname = e.data.last_name+' '+e.data.first_name;
  console.debug(point)
  t.AccountMap.setPoints([point]);
  //t.AccountMap.render();
});



t.SelectAccounts.on('Change', function (e) {
  var idaccount = t.SelectAccounts.get('value');   

  if(idaccount > 0){
   t.Basic.set("idaccount", idaccount);


   t.ContactsUsers.set('idaccount', idaccount);
   t.Equipments.set('idaccount', idaccount);
   t.EventsIsOpen.set('idaccount', idaccount);

 }else{
  t._disable_element(t.ContentForms, true);
  t._notifications({ Urgency: 10, Message: 'No ha seleccionado un registro correcto', Title: 'Selección Incorrecta' });

}

});                                                	


},
_disable_element: function(_element, _disable){

  if(_disable){
    domClass.add(_element, "element-disabled");
  }else{
    domClass.remove(_element, "element-disabled");
  }
  return this;
},
_ChangeWidget: function(_btn){
  var t = this;
  //query(".widgetMember", t.domNode).style("display", "none");
  query(".btn", t.BlockButton).removeClass("btn-primary");
  domClass.add(_btn, "btn-primary");     
},
resize: function() {
 var t = this;
 t.Basic.resize();
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
