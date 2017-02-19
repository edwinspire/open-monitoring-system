define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/account_events_management/account_events_management.html',
  "dojo/dom-class",
  "dojo/on",
  "Widget/EventDetails/EventDetails",
  "Widget/uDCGridWidget/uDCGridWidget",
  "FilteringSelectLiveStore/FilteringSelectLiveStore",
  "dijit/form/Textarea"
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

       this.EventsIsOpen.on('ClickRow', function(e){

        t.EDetails.set('event', e);
      });


     },
     _setIdaccountAttr: function (_v) {
         // this.account_events_assignment.set('value', _v);
         console.log('Se quiere account_events_assignment setear a '+_v);
     
     this.EventsIsOpen.Grid.Select({idaccount: _v});
//     this.EventsIsOpen.uDC.setField('idaccount', _v);   
     this.SelectAccountUser.request({_uDCTable: 'view_account_contacts', idaccount: _v});
     this.SelectAccountEquipments.request({_uDCTable: 'equipments_by_account', idaccount: _v});
      },
      _getValueAttr: function () {
         // return this.account_events_assignment.get('value');
       } ,
       resize: function(){


        this.EventsIsOpen.resize();
      },
      reset: function () {

      }      
      
    });
   });
