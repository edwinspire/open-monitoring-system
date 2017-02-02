define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/account_equipments/account_equipments.html',
    "dojo/dom-class",
    "dojo/on",
    "dijit/form/TextBox",
    "Widget/uDCGridWidget/uDCGridWidget",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer"
    ], function (declare, _Widget, _Templated, templateString, domClass, on) {
/**
     * Account Equipments
     *
     * @module account_equipments/account_equipments
     */
     return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
           var t = this;
           t.TNetwork.on('addok', function(e){
            t.uDCNewNetworkEquipment.Insert();
        });


       },
       _setIdaccountAttr: function (_v) {

           console.log('Se quiere account_equipments setear a '+_v);
           this.TGeneral.Grid.Select({idaccount: _v});
           this.TNetwork.Grid.Select({idaccount: _v});
           this.uDCNewNetworkEquipment.set('field', 'idaccount', _v);
       },
       _getValueAttr: function () {
         // return this.account_equipments.get('value');
     } ,
     resize: function(){
        this.Tab.resize();
        //this.TGeneral.resize();
        //this.TNetwork.resize();
    },
    reset: function () {
          //  this.account_equipments.reset();
      }      

  });
 });
