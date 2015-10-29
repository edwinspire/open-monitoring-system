define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_account_types_list/woams_account_types_list.html',
    'jspire/form/FilteringSelect'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _tempValue: 0,
        postCreate: function () {

            var t = this;
            t.FS.url = "oams_php_query/account_types_list_selection.php";
            t.FS.load_json();

        },
        validate: function () {
            return this.FS.validate();
        },
        _getValueAttr: function () {
            return this.FS.get('value');
        },
        reset: function () {
            this.FS.reset();
        },
        _setValueAttr: function (v) {
            this.FS.set('value', String(v));
            this._tempValue = v;
        },
        displayedValue: function () {
            return this.FS.get('displayedValue');
        },
        focus: function () {
            return this.FS.focus();
        }



    });
});
