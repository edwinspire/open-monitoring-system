/**

 * Handles elements

 * @namespace OpenMonitoringSystem

 */
 define([
 	'dojo/_base/declare',
 	'dijit/_Widget',
 	'dijit/_Templated',
 	'dojo/text!Widget/contact_means_of_contact/contact_means_of_contact.html',
  "Widget/uDCGridWidget/uDCGridWidget",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane"
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
      postCreate: function(){
       // this.resize();        
      },
      _setIdcontactAttr: function (_id) {
        this.IdAccount = _id;
        this.TPhones.Grid.Select({idcontact: this.IdAccount});                                    
        this.TEmails.Grid.Select({idcontact: this.IdAccount}); 
        this.resize();
      },
      resize: function(){
        this.TabMaster.resize();
      }




        // Fin de funciones //
        //************************************//
      });
   });
