define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/app_monitor_network_devices/app_monitor_network_devices.html',
    "Widget/uDCGridWidget/uDCGridWidget"
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
	var t = this;
	

        }      
                
    });
});
