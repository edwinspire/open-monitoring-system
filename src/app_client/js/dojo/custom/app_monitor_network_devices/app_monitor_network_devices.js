define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!app_monitor_network_devices/app_monitor_network_devices.html',
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
