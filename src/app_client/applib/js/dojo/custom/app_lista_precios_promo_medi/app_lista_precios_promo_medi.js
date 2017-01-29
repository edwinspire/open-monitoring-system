define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/app_lista_precios_promo_medi/app_lista_precios_promo_medi.html',
    "dojo/dom-class",
    "dojo/on",
    "Widget/uDCGridWidget/uDCGridWidget"
], function (declare, _Widget, _Templated, templateString, domClass, on) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
	var t = this;
	

        }      
                
    });
});
