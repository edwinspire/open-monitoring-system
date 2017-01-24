define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!SelectGender/SelectGender.html'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
            var t = this;

t.FS.queryExpr = '*${0}*';
t.FS.searchDelay = 1000;

	var icon = t.get("data-input-icon"); 
	
	if(icon){
	domClass.remove(t.Icon);
	domClass.add(t.Icon, icon);
	}

                t.FS.on('Change', function (e) {

t.emit('Change', {value: t.get('value')});
                });


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
console.log('setea a '+v);
        },
        displayedValue: function () {
            return this.FS.get('displayedValue');
        },
        focus: function () {
            return this.FS.focus();
        }


    });
});
