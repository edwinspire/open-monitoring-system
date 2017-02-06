define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/app_event_management/app_event_management.html',
  "dojo/dom-class",
  "dojo/on",
  "dojo/window",
  "dojo/dom-style",
  "dojo/aspect",
  "dijit/registry",
  "dijit/layout/TabContainer",
  "Widget/EventDetails/EventDetails",
  "Widget/account_details/account_details",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "dijit/form/Textarea",
  "Widget/uDCGridWidget/uDCGridWidget",
  "Widget/EventDetails/EventDetails",
  "Widget/uDC/uDC",
  "Widget/account_details/account_details",
  "FilteringSelectGlobalStore/FilteringSelectGlobalStore",
  "FilteringSelectLiveStore/FilteringSelectLiveStore"
  ], function (declare, 
    _Widget, 
    _Templated, 
    templateString, 
    domClass, 
    on, 
    win, 
    domStyle, 
    aspect, 
    ContentPane, 
    TabContainer,
    EventDetails,
    account_details) {
/**
     * Account Events is Open
     *
     * @module account_events_isopen/account_events_isopen
     */
     return declare([_Widget, _Templated], {
      widgetsInTemplate: true,
      templateString: templateString,
      postCreate: function () {
       var t = this;

       var vs = win.getBox();
       console.debug(vs);
       domStyle.set(this.BorderContainer.domNode, "height", (vs.h-30-16)+'px');
       
       //t.CPEvents.startup();
       // t.CPEvents.resize();

//t.TABEvents.selectChild(t.TABEvents1);

//     var TABEvents = new TabContainer({
//         style: "height: 100%; width: 100%;"
//     }, t.CPEvents.domNode);

//     var cp1 = new ContentPane({
//          title: "DETALLE EVENT"});
//     TABEvents.addChild(cp1);

//     var cp2 = new ContentPane({
//          title: "DETALLE ABONADO"});
//     TABEvents.addChild(cp2);


// var EDetails = new EventDetails();
// cp1.addChild(EDetails);

// var AccountDetails = new account_details();
// cp2.addChild(AccountDetails);

    //t.TABEvents.startup();


    aspect.after(t.CLeft, "resize", function(e) {
      t.GridEvents.autoHeight();
  //    t.TABEvents.resize();
    });

    t.SelectAccounts.queryExpr = '*${0}*';
    t.SelectAccountEquipments.queryExpr = '*${0}*';
    t.SelectAccountUser.queryExpr = '*${0}*';

    t.SelectAccounts.on('Change', function(e){
      t.SelectAccountUser.request({_uDCTable: 'view_account_contacts', idaccount: e});
      t.SelectAccountEquipments.request({_uDCTable: 'equipments_by_account', idaccount: e});
    });

    t.GridEvents.on('addok', function(e){
      t.uDCNewEvent.Insert();
    });

    t.GridEvents.on('ClickRow', function(e){
//      console.log(e);
      t.EDetails.set('event', e);
      t.AccountDetails.set('idaccount', e.idaccount);
      //t.TABEvents.resize();
      //t.TABEvents.selectChild(t.AccountDetails);
    });

//t.startup();

this.BorderContainer.resize();
  },
  _setIdaccountAttr: function (_v) {

  },
  _getValueAttr: function () {
         // return this.account_events_assignment.get('value');
       } ,
       resize: function(){
        this.BorderContainer.resize();
    //    this.TABEvents.resize();
         // this.CPEvents.resize();
         this.CPEvents.resize();

       },
       reset: function () {
          //  this.account_events_assignment.reset();
        }      

      });
   });
