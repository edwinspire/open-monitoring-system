define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!select_divisions/select_divisions.php'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
               postCreate: function () {
          
         var t = this;
          
            t.S2 =  $(t.Select).select2({
          placeholder: "Select a state",
          allowClear: true,
          theme: "classic"
        }).on("change", function (e) {
t.emit('onChange', {value: t.Select.value});
});


        },
        _setValueAttr: function (_v) {
          this.S2.val(_v).trigger("change");
        },
        _getValueAttr: function () {
          return this.Select.value;
        }



    });
});
