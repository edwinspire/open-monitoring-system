define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/app_accounts_list/app_accounts_list.html',
  "dojo/dom-class",
  "dojo/on",
  "dojo/window",
  "dojo/dom-style",
  "dojo/aspect",
  "Widget/FSGS_Divisions",
  ], function (declare, 
    _Widget, 
    _Templated, 
    templateString, 
    domClass, 
    on, 
    win, 
    domStyle, 
    aspect, 
    FSGS_Divisions) {
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

t.DGrid.ToolBarAppendSeparator();
t.DGrid.ToolbarAddWidget(new FSGS_Divisions());

       var vs = win.getBox();
       domStyle.set(this.domNode, "height", (vs.h-30-16)+'px');
       
       aspect.after(t.BorderContainer, "resize", function(e) {
        t.DGrid.autoHeight();
});

       //t.SelectAccounts.queryExpr = '*${0}*';
       //t.SelectAccountEquipments.queryExpr = '*${0}*';
       //t.SelectAccountUser.queryExpr = '*${0}*';
/*
       t.SelectAccounts.on('Change', function(e){
        t.SelectAccountUser.request({_uDCTable: 'view_account_contacts', idaccount: e});
        t.SelectAccountEquipments.request({_uDCTable: 'equipments_by_account', idaccount: e});
      });

       t.DGrid.on('addok', function(e){
        t.uDCNewEvent.Insert();
      });
      */


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
         //this.CPEvents.resize();

       },
       reset: function () {
          //  this.account_events_assignment.reset();
        }      

      });
   });
