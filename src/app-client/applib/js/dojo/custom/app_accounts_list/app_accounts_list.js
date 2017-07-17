define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/app_accounts_list/app_accounts_list.html',
  "dojo/dom-class",
  "dojo/on",
  "dojo/window",
  "dojo/dom-style",
  "dojo/aspect",
  "Widget/FilteringSelectGlobalStore/FilteringSelectGlobalStore"
  ], function (declare, 
    _Widget, 
    _Templated, 
    templateString, 
    domClass, 
    on, 
    win, 
    domStyle, 
    aspect, 
    FilteringSelectGlobalStore) {
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
       domStyle.set(this.domNode, "height", (vs.h-30-16)+'px');

console.debug(t.SelectDivisions);       

        t.SelectDivisions.on('change', function(e){
alert(e);
        });
                
        t.SelectDivisions.on('onchange', function(e){
alert(e);
        });


dojo.connect(t.SelectDivisions, 'Change', function(){
  alert()
});

        t.SelectDivisions.on('change', function(e){
alert(e);
        });



       aspect.after(t.BorderContainer, "resize", function(e) {
        t.DGrid.autoHeight();
      });

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
