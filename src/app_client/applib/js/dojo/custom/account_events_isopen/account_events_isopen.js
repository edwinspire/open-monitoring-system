define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!account_events_isopen/account_events_isopen.html',
    "dojo/dom-class",
    "dojo/on"
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
//t.CollapseLink.set('contentelement', t.XContent);
//t.CollapseLink.Down();
this.EventsIsOpen.on('ClickRow', function(e){
//console.log(e);
t.EDetails.set('event', e);
});


        },
        _setIdaccountAttr: function (_v) {
         // this.account_events_assignment.set('value', _v);
         console.log('Se quiere account_events_assignment setear a '+_v);
     //  this.uDC.set('field', 'idcontact', _v);

     
         this.EventsIsOpen.Grid.Select({idaccount: _v});
         this.EventsIsOpen.uDC.setField('idaccount', _v);   
         this.SelectAccountUser.request({_uDCTable: 'view_account_contacts', idaccount: _v});
         this.SelectAccountEquipments.request({_uDCTable: 'equipments_by_account', idaccount: _v});
        //  this.TNetwork.uDC.set('field', 'idaccount', _v);
        },
        _getValueAttr: function () {
         // return this.account_events_assignment.get('value');
        } ,
        resize: function(){
        	//this.TGeneral.resize();
        	        	//this.TNetwork.resize();
        	        	this.EventsIsOpen.resize();
        },
        reset: function () {
          //  this.account_events_assignment.reset();
        }      
                
    });
});
