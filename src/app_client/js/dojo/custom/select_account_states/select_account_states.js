define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!select_account_states/select_account_states.php'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
          
         var t = this;

          
                 $(t.Select).select2({
          placeholder: "Select",
          allowClear: true,
          theme: "classic"
        }).on("change", function (e) {
t.onChange({value: t.Select.value});
});


        },
        _setValueAttr: function (_v) {
           this.Select.value = String(_v);
//console.log(this.Select.value);
        },
        _getValueAttr: function () {
          return this.Select.value;
        },
onChange(evt){

},
        validate: function () {
            return this.Select.validate();
        },
        reset: function () {
            this.Select.reset();
        }


    });
});
