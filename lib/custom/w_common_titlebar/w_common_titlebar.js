define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!w_common_titlebar/w_common_titlebar.html'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
            this.set("label", "Titulo");
        },
        _setLabelAttr: function (label_) {
            this.label.innerHTML = label_;
        }
    });
});
