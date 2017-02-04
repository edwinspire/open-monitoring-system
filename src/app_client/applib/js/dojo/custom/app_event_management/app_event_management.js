define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/app_event_management/app_event_management.html',
  "dojo/dom-class",
  "dojo/on",
  "dojo/window",
  "dojo/dom-style",
  "dojo/aspect", "dijit/registry",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "dijit/form/Textarea",
  "Widget/uDCGridWidget/uDCGridWidget",
  "Widget/EventDetails/EventDetails",
  "Widget/uDC/uDC",
  "Widget/account_details/account_details",
  "FilteringSelectGlobalStore/FilteringSelectGlobalStore",
  "FilteringSelectLiveStore/FilteringSelectLiveStore"
  ], function (declare, _Widget, _Templated, templateString, domClass, on, win, domStyle, aspect, registry) {
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
       domStyle.set(this.domNode, "height", (vs.h-30+30)+'px');

      //  on(window, 'resize', function(){
      //   //  vs = win.getBox();
      // //  domStyle.set(t.domNode, "height", (vs.h-30+30)+'px');        
      // });

       aspect.after(t.CLeft, "resize", function(e) {
        t.GridEvents.set('sizecontainer', {height: domStyle.get(t.CLeft.domNode, "height")});
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
        console.log(e);
        t.EDetails.set('event', e);
        t.AccountDetails.set('idaccount', e.idaccount);
      });


     },
     _setIdaccountAttr: function (_v) {
        // console.log('Se quiere account_events_assignment setear a '+_v);     
       //  this.GridEvents.Grid.Select({});
       //  this.SelectAccountUser.request({_uDCTable: 'view_account_contacts', idaccount: _v});
       //  this.SelectAccountEquipments.request({_uDCTable: 'equipments_by_account', idaccount: _v});
     },
     _getValueAttr: function () {
         // return this.account_events_assignment.get('value');
       } ,
       resize: function(){
        this.BorderContainer.resize();

      },
      reset: function () {
          //  this.account_events_assignment.reset();
        }      

      });
   });
