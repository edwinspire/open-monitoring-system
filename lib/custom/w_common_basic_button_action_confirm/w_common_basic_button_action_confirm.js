define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!w_common_basic_button_action_confirm/w_common_basic_button_action_confirm.html',
    'w_common_tooltipdialogconfirmation/w_common_tooltipdialogconfirmation'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
            var t = this;
            t.dialogdelete.dijitOwner(t.Button, 'Click').on('onok', function () {
                t.emit('onclick', {});
            });
        }






    });
});
