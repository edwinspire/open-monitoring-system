define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_contacts_list/woams_contacts_list.html',
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _tempValue: 0,
        postCreate: function () {

            var t = this;
            t.FS.url = "oams_php_query/accounts_list.php";
            t.FS.load_json();
            t.FS.queryExpr = '*${0}*';
            t.FS.searchDelay = 1000;

        },
        validate: function () {
            return this.FS.validate();
        },
        _getValueAttr: function () {
            return this.FS.get('value');
        },
        _setDisabledAttr: function (_d) {
            this.FS.set('disabled', _d);
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
