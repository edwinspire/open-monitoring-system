define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/app_event_management/app_event_management.html',
  "dojo/dom-class",
  "dojo/on",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "Widget/uDCGridWidget/uDCGridWidget",
  "Widget/EventDetails/EventDetails",
  "Widget/uDC/uDC",
  "FilteringSelectGlobalStore/FilteringSelectGlobalStore",
  "dijit/form/Textarea",
  "FilteringSelectLiveStore/FilteringSelectLiveStore",
  "Widget/account_details/account_details"
  ], function (declare, _Widget, _Templated, templateString, domClass, on) {
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
       t.SelectAccountEquipments.queryExpr = '*${0}*';
       t.SelectAccountUser.queryExpr = '*${0}*';
       t.GridEvents.on('ClickRow', function(e){
        console.log(e);
        t.EDetails.set('event', e);
        t.AccountDetails.set(e.idaccount);
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
