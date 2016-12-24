define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!account_contacts_users/account_contacts_users.html',
    "dojo/dom-class",
    "dojo/on"
], function (declare, _Widget, _Templated, templateString, domClass, on) {
    /**
     * Account Contacts Users Widget
     *
     * @module account_contacts_users/account_contacts_users
     */
    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
	var t = this;
	
//t.CollapseLink.set('contentelement', t.XContent);
this.TContacts.on('ClickRow', function(e){
console.log(e);
//t.EDetails.set('event', e);
t.CData.set('idcontact', e.idcontact);
});


        },
        _setIdaccountAttr: function (_v) {
         // this.account_contacts_users.set('value', _v);
         console.log('Se quiere ContactsUsers setear a '+_v);
         this.TContacts.Grid.Select({idaccount: _v});
       //  this.TUsers.Grid.Select({idaccount: _v});
        },
        _getValueAttr: function () {
         // return this.account_contacts_users.get('value');
        } ,
        reset: function () {
          //  this.account_contacts_users.reset();
        },
resize: function(){
this.TContacts.resize();
        // this.TUsers.resize();
         return this;
},
Clear: function(){
this.TContacts.Clear();
//this.TUsers.Clear();
}  
                
    });
});
