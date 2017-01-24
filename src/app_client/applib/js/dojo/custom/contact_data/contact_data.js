define(['dojo/_base/declare',
	'dijit/_Widget',
	'dijit/_Templated',
	'dojo/text!Widget/contact_data/contact_data.html',
	"dojo/on",
	"uDC/uDC"
	], function (declare, _Widget, _Templated, templateString,  on, uDC) {
    /**
     * Account Data
     *
     * @module account_data/account_data
     */
     return declare([_Widget, _Templated], {
     	widgetsInTemplate: true,
     	templateString: templateString,
     	IdContact: -999,
        uDCContact: {},
        postCreate: function () {
        	var t = this;
//this.uDCContact = new uDC({});
          /*
                       t.uDC.on('onSelect', function(e){
	       t.TGroups.set('groups', e.data.iddivision, e.data.groups);                            
  });
               
                       t.Division.on('Change', function(e){
                       console.log('Cambia la division', e, t.Division.get('value'));
	       t.TGroups.set('groups', t.Division.get('value'), []);                            
  });
  */            
//console.log(this.uDCContact, this.CMC);





},
resize: function (s) {
            //this.BC1.resize({h: '40%'});
            //console.log("Cambiando de tamaño");
        },
        _setIdcontactAttr: function (_id) {
        	this.IdContact = _id;
        	this.uDCContact.Select(this.IdContact);                       
            //this.TPhones.Grid.Select({idcontact: this.IdAccount});                                    
            //this.TEmails.Grid.Select({idcontact: this.IdAccount}); 
            this.CMC.set('idcontact', this.IdContact); 

        },
        _getIdcontactAttr: function () {
        	return this.IdContact;
        },
        Update: function(){
        	this.uDCContact.Update();
        },
        Clear: function(){
        	this.uDCContact.Clear();
               // this.TPhones.Clear();
               // this.TEmails.Clear();
           }












       });
 });
