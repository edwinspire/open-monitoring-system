define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!app_login_report/app_login_report.html',
    "dojo/dom-class",
    "dojo/on"
], function (declare, _Widget, _Templated, templateString, domClass, on) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
	var t = this;
	

        }      
                
    });
});
