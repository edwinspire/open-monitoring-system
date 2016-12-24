define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!account_data/account_data.html',
    "dojo/on",
        "uDC/uDC"
], function (declare, _Widget, _Templated, templateString,  on) {
    /**
     * Account Data
     *
     * @module account_data/account_data
     */
    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        IdAccount: -999,
        //uDC: new uDataControl(),
        postCreate: function () {
            var t = this;
            
          
                       t.uDC.on('onSelect', function(e){
	       t.TGroups.set('groups', e.data.iddivision, e.data.groups);                            
  });
               
                       t.Division.on('Change', function(e){
                       console.log('Cambia la division', e, t.Division.get('value'));
	       t.TGroups.set('groups', t.Division.get('value'), []);                            
  });





        },
        onChange: function () {

        },
        resize: function (s) {
            //this.BC1.resize({h: '40%'});
            //console.log("Cambiando de tamaño");
        },
        _setIdaccountAttr: function (_id) {
            this.IdAccount = _id;
            this.uDC.Select(this.IdAccount);                       
            //this.TPhones.Grid.Select({idcontact: this.IdAccount});                                    
            //this.TEmails.Grid.Select({idcontact: this.IdAccount}); 
            this.CMC.set('idcontact', this.IdAccount); 

        },
        _getIdaccountAttr: function () {
            return this.IdAccount;
        },
        Update: function(){
        this.uDC.Update();
        },
        Clear: function(){
                this.uDC.Clear();
               // this.TPhones.Clear();
               // this.TEmails.Clear();
        }












    });
});
