define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!w_editable_div/w_editable_div.html'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        name: '',
        postCreate: function () {
//this.set("label", "Titulo");
        },
        _setValueAttr: function (_html) {
            this.domNode.innerHTML = _html;
//console.log(_html);
        },
        _getValueAttr: function () {
            console.warn(this.domNode.innerHTML);
            return this.domNode.innerHTML;
        },
        reset: function () {
            this.set('value', '');
        },
        validate: function () {
            return true;
        }


    });
});
