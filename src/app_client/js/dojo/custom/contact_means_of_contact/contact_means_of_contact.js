/**

 * Handles elements

 * @namespace OpenMonitoringSystem

 */
 define([
 	'dojo/_base/declare',
 	'dijit/_Widget',
 	'dijit/_Templated',
 	'dojo/text!contact_means_of_contact/contact_means_of_contact.html',
  "Widget/uDCGridWidget/uDCGridWidget"
 	], function (declare, _Widget, _Templated, templateString) {
    /**
     * Micro Data Connector
     *
     * @module uDC/uDC
     */
     return declare([_Widget, _Templated], {
      widgetsInTemplate: true,
      templateString: templateString,
      IdAccount: -9,
              _setIdcontactAttr: function (_id) {
            this.IdAccount = _id;
            //this.uDC.Select(this.IdAccount);                       
            this.TPhones.Grid.Select({idcontact: this.IdAccount});                                    
            this.TEmails.Grid.Select({idcontact: this.IdAccount}); 

        },




        // Fin de funciones //
        //************************************//
      });
});
