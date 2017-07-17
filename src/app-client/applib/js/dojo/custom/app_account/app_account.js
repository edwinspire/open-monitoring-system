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
  "dijit/layout/ContentPane",
  "FilteringSelectGlobalStore/FilteringSelectGlobalStore",
  "dijit/layout/TabContainer",
  "dijit/ToolbarSeparator",
  "Widget/account_details/account_details",
  "dijit/form/FilteringSelect"
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





on(t.Save, 'click', function () {
  console.log('Se hecho click en guardar');
  t.AccountDetails.Update();
});


t.AddAccount.on('Execute', function(){
  t.uDCNewAccount.Insert();
});





t.SelectAccounts.on('Change', function (e) {
  var idaccount = t.SelectAccounts.get('value');   
  console.debug(idaccount);
  if(idaccount > 0){
   t.AccountDetails.set('idaccount', idaccount);

   // t.Basic.set("idaccount", idaccount);


   // t.ContactsUsers.set('idaccount', idaccount);
   // t.Equipments.set('idaccount', idaccount);
   // t.EventsIsOpen.set('idaccount', idaccount);

 }else{
  t._disable_element(t.ContentForms, true);
  t._notifications({ Urgency: 10, Message: 'No ha seleccionado un registro correcto', Title: 'Selección Incorrecta' });

}

});                                                	


},
resize: function() {
 var t = this;
 t.AccountDetails.resize();
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
